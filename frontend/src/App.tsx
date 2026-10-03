import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AggregatorDashboard } from './pages/AggregatorDashboard'
import { BuyerMarketplace } from './pages/BuyerMarketplace'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/aggregator" element={<AggregatorDashboard />} />
        <Route path="/marketplace" element={<BuyerMarketplace />} />
        <Route path="/" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground dark">
            <h1 className="text-4xl font-bold mb-8">GroundWork OS</h1>
            <div className="flex gap-4">
              <a href="/aggregator" className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">View Aggregator UI</a>
              <a href="/marketplace" className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md font-medium hover:bg-secondary/90 transition-colors">View Marketplace UI</a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}
