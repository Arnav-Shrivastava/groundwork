import { useEffect, useRef, useState } from "react"
import * as maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { TerraDraw, TerraDrawPolygonMode } from "terra-draw"
import { TerraDrawMapLibreGLAdapter } from "terra-draw-maplibre-gl-adapter"
import { useAuthStore } from "../../store/authStore"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { toast } from "sonner"

export function MapCanvas() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const draw = useRef<TerraDraw | null>(null)
  const [farms, setFarms] = useState<any[]>([])
  const [drawing, setDrawing] = useState(false)
  const [farmName, setFarmName] = useState("")
  const [currentGeometry, setCurrentGeometry] = useState<any>(null)
  const token = useAuthStore(state => state.token)

  useEffect(() => {
    if (map.current || !mapContainer.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [-95.7129, 37.0902],
      zoom: 4,
    })

    map.current.on("load", () => {
      draw.current = new TerraDraw({
        adapter: new TerraDrawMapLibreGLAdapter({ map: map.current! }),
        modes: [new TerraDrawPolygonMode()],
      })

      draw.current.start()
      
      draw.current.on("change", () => {
        const snapshot = draw.current!.getSnapshot()
        if (snapshot.length > 0) {
          setCurrentGeometry(snapshot[snapshot.length - 1].geometry)
        }
      })

      fetchFarms()
    })

    return () => {
      if (draw.current) {
        draw.current.stop()
      }
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  const fetchFarms = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/farms", {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setFarms(data)
        
        // Render existing farms on map
        if (map.current && map.current.isStyleLoaded()) {
          const sourceId = "existing-farms"
          if (map.current.getSource(sourceId)) {
            (map.current.getSource(sourceId) as maplibregl.GeoJSONSource).setData({
              type: "FeatureCollection",
              features: data.map((f: any) => ({
                type: "Feature",
                geometry: JSON.parse(f.geometry),
                properties: { name: f.name }
              }))
            })
          } else {
            map.current.addSource(sourceId, {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: data.map((f: any) => ({
                  type: "Feature",
                  geometry: JSON.parse(f.geometry),
                  properties: { name: f.name }
                }))
              }
            })
            map.current.addLayer({
              id: "existing-farms-fill",
              type: "fill",
              source: sourceId,
              paint: {
                "fill-color": "hsl(142 70.6% 45.3%)",
                "fill-opacity": 0.4
              }
            })
            map.current.addLayer({
              id: "existing-farms-line",
              type: "line",
              source: sourceId,
              paint: {
                "line-color": "hsl(142 70.6% 45.3%)",
                "line-width": 2
              }
            })
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch farms", err)
    }
  }

  const startDrawing = () => {
    if (draw.current) {
      draw.current.setMode("polygon")
      setDrawing(true)
    }
  }

  const cancelDrawing = () => {
    if (draw.current) {
      draw.current.clear()
      draw.current.setMode("static")
      setDrawing(false)
      setCurrentGeometry(null)
    }
  }

  const saveFarm = async () => {
    if (!farmName || !currentGeometry) {
      toast.error("Please provide a name and draw a polygon")
      return
    }

    try {
      const res = await fetch("http://localhost:8000/api/farms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: farmName,
          geometry: JSON.stringify(currentGeometry)
        })
      })

      if (res.ok) {
        toast.success("Farm registered successfully!")
        setFarmName("")
        cancelDrawing()
        fetchFarms()
      } else {
        toast.error("Failed to save farm")
      }
    } catch (err) {
      toast.error("An error occurred")
    }
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Farms & Geometries</h2>
        {!drawing ? (
          <Button onClick={startDrawing}>Register New Farm</Button>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 mr-4">
              <Label htmlFor="name">Farm Name</Label>
              <Input 
                id="name" 
                value={farmName} 
                onChange={e => setFarmName(e.target.value)} 
                placeholder="e.g. North Field"
                className="w-48"
              />
            </div>
            <Button variant="outline" onClick={cancelDrawing}>Cancel</Button>
            <Button onClick={saveFarm}>Save Geometry</Button>
          </div>
        )}
      </div>
      
      <div className="flex-1 border rounded-md overflow-hidden relative min-h-[400px]">
        <div ref={mapContainer} className="absolute inset-0" />
        {drawing && (
          <div className="absolute top-4 left-4 bg-background/80 backdrop-blur p-2 rounded text-sm font-medium border">
            Click on the map to draw points. Double click to finish polygon.
          </div>
        )}
      </div>
    </div>
  )
}
