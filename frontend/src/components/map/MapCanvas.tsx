import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock token for local dev - would come from env in production
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibW9jay11c2VyIiwiYSI6ImNtb2NrLXRva2VuIn0.mock-token';

export function MapCanvas() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [geoJSONData, setGeoJSONData] = useState<any>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-74.5, 40],
      zoom: 9
    });

    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    });

    map.current.addControl(draw.current);

    map.current.on('draw.create', updateArea);
    map.current.on('draw.delete', updateArea);
    map.current.on('draw.update', updateArea);

    function updateArea(e: any) {
      const data = draw.current?.getAll();
      if (data && data.features.length > 0) {
        setGeoJSONData(data);
        setPanelOpen(true);
      } else {
        setPanelOpen(false);
        setGeoJSONData(null);
      }
    }
  }, []);

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      <div ref={mapContainer} className="absolute inset-0" />
      
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-4 right-4 w-80 bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-xl shadow-2xl z-10"
          >
            <h3 className="text-lg font-semibold mb-4 text-emerald-400">Save Farm Boundary</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="farmer">Farmer Name</Label>
                <Input id="farmer" placeholder="e.g. John Doe" className="bg-zinc-950/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crop">Crop Type</Label>
                <Input id="crop" placeholder="e.g. Coffee" className="bg-zinc-950/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hectares">Calculated Hectares</Label>
                <Input id="hectares" value="12.5" readOnly className="bg-zinc-950/50 border-white/10 text-muted-foreground" />
              </div>
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium mt-4">
                Save Farm Profile
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
