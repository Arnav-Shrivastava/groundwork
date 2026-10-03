import { Search, Globe, Filter, Box } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"

export function BuyerMarketplace() {
  return (
    <div className="min-h-screen bg-background dark text-foreground flex flex-col">
      {/* Top Nav */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 mr-4">
            <Globe className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">GroundWork Market</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="text-foreground transition-colors hover:text-foreground">Explore Batches</a>
            <a href="#" className="transition-colors hover:text-foreground">My Portfolio</a>
            <a href="#" className="transition-colors hover:text-foreground">Retirements</a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search regions, crops..."
              className="w-full bg-background pl-9 border-border focus-visible:ring-primary"
            />
          </div>
          <Button>Connect Wallet</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Available Credits</h1>
            <p className="text-muted-foreground mt-1">Discover high-quality, verified agricultural carbon credits.</p>
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mock Card 1 */}
          <Card className="bg-card border-border overflow-hidden flex flex-col hover:border-primary/50 transition-colors">
            <div className="h-48 bg-muted relative">
              {/* Mock map or image placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background flex items-center justify-center">
                <Globe className="w-12 h-12 text-primary/40" />
              </div>
              <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur text-foreground border-border hover:bg-background/90">
                Verra
              </Badge>
              <Badge variant="secondary" className="absolute top-4 right-4 bg-primary/20 text-primary border-none">
                Forward (2025)
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Cerrado Soy Transition</CardTitle>
              <div className="text-sm text-muted-foreground mt-1">Brazil • 1,500 ha</div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Available Volume</div>
                    <div className="text-2xl font-light">5,000 <span className="text-sm text-muted-foreground">tCO2e</span></div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">Price</div>
                    <div className="text-2xl font-medium text-primary">$18.50</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="text-xs font-normal">Biodiversity</Badge>
                  <Badge variant="outline" className="text-xs font-normal">Water</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-border/50">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Box className="w-4 h-4 mr-2" /> Purchase Credits
              </Button>
            </CardFooter>
          </Card>

          {/* Mock Card 2 */}
          <Card className="bg-card border-border overflow-hidden flex flex-col hover:border-primary/50 transition-colors">
            <div className="h-48 bg-muted relative">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-background flex items-center justify-center">
                <Globe className="w-12 h-12 text-muted-foreground/40" />
              </div>
              <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur text-foreground border-border hover:bg-background/90">
                Gold Standard
              </Badge>
              <Badge variant="secondary" className="absolute top-4 right-4 bg-secondary text-secondary-foreground border-none">
                Issued
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Midwest Regenerative Corn</CardTitle>
              <div className="text-sm text-muted-foreground mt-1">USA • 850 ha</div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Available Volume</div>
                    <div className="text-2xl font-light">1,200 <span className="text-sm text-muted-foreground">tCO2e</span></div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">Price</div>
                    <div className="text-2xl font-medium text-primary">$25.00</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="text-xs font-normal">Soil Health</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-border/50">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Box className="w-4 h-4 mr-2" /> Purchase Credits
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
