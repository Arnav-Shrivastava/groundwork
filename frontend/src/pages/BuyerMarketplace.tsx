import { useState, useEffect } from "react"
import { Search, Globe, Filter, Box } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Label } from "../components/ui/label"
import { useAuthStore } from "../store/authStore"
import { toast } from "sonner"

export function BuyerMarketplace() {
  const [listings, setListings] = useState<any[]>([])
  const [selectedBatch, setSelectedBatch] = useState<any | null>(null)
  const [purchaseAmount, setPurchaseAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const token = useAuthStore(state => state.token)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/marketplace")
      if (res.ok) {
        const data = await res.json()
        setListings(data)
      }
    } catch (err) {
      console.error("Failed to fetch listings", err)
    }
  }

  const handlePurchase = async () => {
    if (!selectedBatch || !purchaseAmount) return
    setIsSubmitting(true)
    try {
      const res = await fetch("http://localhost:8000/api/transactions/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          batch_id: selectedBatch.id,
          tonnes_requested: parseFloat(purchaseAmount)
        })
      })

      if (res.ok) {
        toast.success("Purchase successful!")
        setSelectedBatch(null)
        setPurchaseAmount("")
        fetchListings()
      } else {
        const error = await res.json()
        toast.error(error.detail || "Failed to complete purchase")
      }
    } catch (err) {
      toast.error("An error occurred during checkout")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background dark text-foreground flex flex-col">
      <header className="h-16 border-b bg-card flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 mr-4">
            <Globe className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">GroundWork Market</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="text-foreground transition-colors hover:text-foreground">Explore Batches</a>
            <a href="#" className="transition-colors hover:text-foreground">My Portfolio</a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search regions, crops..." className="w-full bg-background pl-9 border-border focus-visible:ring-primary" />
          </div>
          <Button variant="outline" onClick={() => useAuthStore.getState().logout()}>Logout</Button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Available Credits</h1>
            <p className="text-muted-foreground mt-1">Discover high-quality, verified agricultural carbon credits. <span className="text-primary text-xs ml-2 uppercase tracking-widest font-semibold border border-primary/30 rounded px-1.5 py-0.5 bg-primary/10">Demo Data</span></p>
          </div>
          <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filters</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((batch) => (
            <Card key={batch.id} className="bg-card border-border overflow-hidden flex flex-col hover:border-primary/50 transition-colors">
              <div className="h-48 bg-muted relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background flex items-center justify-center">
                  <Globe className="w-12 h-12 text-primary/40" />
                </div>
                <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur text-foreground border-border hover:bg-background/90">
                  {batch.registry_name || "Verra"}
                </Badge>
                <Badge variant="secondary" className="absolute top-4 right-4 bg-primary/20 text-primary border-none">
                  {batch.delivery_type === "forward" ? "Forward (2025)" : "Issued"}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Agroforestry & Soil Health</CardTitle>
                <div className="text-sm text-muted-foreground mt-1">{batch.region?.name || "Global"} • {batch.region?.country || "Earth"}</div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Available Volume</div>
                      <div className="text-2xl font-light">{batch.available_volume} <span className="text-sm text-muted-foreground">tCO2e</span></div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">Price</div>
                      <div className="text-2xl font-medium text-primary">${batch.price_per_tonne}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-border/50">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setSelectedBatch(batch)}>
                  <Box className="w-4 h-4 mr-2" /> Purchase Credits
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <Dialog open={!!selectedBatch} onOpenChange={(open) => !open && setSelectedBatch(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Purchase Credits</DialogTitle>
            <DialogDescription>
              Enter the amount of tonnes you wish to purchase from this batch. 15% of delivered tonnes will be allocated to the GroundWork buffer pool for permanence.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tonnes" className="text-right">Tonnes (Gross)</Label>
              <Input
                id="tonnes"
                type="number"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                className="col-span-3"
                min="1"
                max={selectedBatch?.available_volume}
              />
            </div>
            {purchaseAmount && (
              <div className="bg-muted p-4 rounded-md space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Gross Tonnes:</span>
                  <span className="font-medium">{parseFloat(purchaseAmount).toFixed(2)} tCO2e</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>To GroundWork Buffer (15%):</span>
                  <span>-{(parseFloat(purchaseAmount) * 0.15).toFixed(2)} tCO2e</span>
                </div>
                <div className="flex justify-between text-primary pt-2 border-t font-medium">
                  <span>Net Deliverable (Scope 3):</span>
                  <span>{(parseFloat(purchaseAmount) * 0.85).toFixed(2)} tCO2e</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-semibold">
                  <span>Total Cost (${selectedBatch?.price_per_tonne}/t):</span>
                  <span>${(parseFloat(purchaseAmount) * selectedBatch?.price_per_tonne).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-1 text-xs text-muted-foreground italic">
                  <span>Effective Price per delivered tonne:</span>
                  <span>${((parseFloat(purchaseAmount) * selectedBatch?.price_per_tonne) / (parseFloat(purchaseAmount) * 0.85)).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBatch(null)}>Cancel</Button>
            <Button onClick={handlePurchase} disabled={isSubmitting || !purchaseAmount}>{isSubmitting ? "Processing..." : "Confirm Purchase"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
