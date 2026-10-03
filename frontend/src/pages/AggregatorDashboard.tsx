import { useState } from "react"
import { LayoutDashboard, Leaf, Activity, Settings, User } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { MapCanvas } from "../components/map/MapCanvas"

export function AggregatorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden dark text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col h-full">
        <div className="p-6 border-b flex items-center space-x-2">
          <Leaf className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">GroundWork OS</span>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          <Button 
            variant={activeTab === "overview" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab !== "overview" && "text-muted-foreground"}`}
            onClick={() => setActiveTab("overview")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" /> Overview
          </Button>
          <Button 
            variant={activeTab === "farms" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab !== "farms" && "text-muted-foreground"}`}
            onClick={() => setActiveTab("farms")}
          >
            <Leaf className="mr-2 h-4 w-4" /> Farms & Geometries
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Activity className="mr-2 h-4 w-4" /> Credit Batches
          </Button>
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 border-b bg-card/50 backdrop-blur flex items-center justify-between px-6 shrink-0">
          <h1 className="text-lg font-semibold">{activeTab === "overview" ? "Dashboard Overview" : "Farms"}</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </header>
        
        <div className="p-6 flex-1 overflow-auto flex flex-col">
          {activeTab === "overview" ? (
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-card shadow-sm border-border">
                <CardHeader className="pb-2">
                  <CardDescription className="text-muted-foreground font-medium">Total Managed Area</CardDescription>
                  <CardTitle className="text-3xl font-light">12,450 <span className="text-lg text-muted-foreground">ha</span></CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-primary flex items-center mt-2 font-medium">
                    +15% from last month
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card shadow-sm border-border">
                <CardHeader className="pb-2">
                  <CardDescription className="text-muted-foreground font-medium">Active Credit Batches</CardDescription>
                  <CardTitle className="text-3xl font-light">8</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground flex items-center mt-2">
                    3 pending verification
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card shadow-sm border-border">
                <CardHeader className="pb-2">
                  <CardDescription className="text-muted-foreground font-medium">Est. Revenue</CardDescription>
                  <CardTitle className="text-3xl font-light">$1.2M</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-primary flex items-center mt-2 font-medium">
                    Based on current listed prices
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <MapCanvas />
          )}
        </div>
      </main>
    </div>
  )
}
