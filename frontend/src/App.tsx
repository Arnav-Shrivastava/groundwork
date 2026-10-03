import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AggregatorDashboard } from './pages/AggregatorDashboard';
import { BuyerMarketplace } from './pages/BuyerMarketplace';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground dark">
          {/* Header/Nav will go here */}
          <main className="container mx-auto py-6">
            <Routes>
              <Route path="/" element={<div>Welcome to GroundWork OS</div>} />
              <Route path="/login" element={<div>Login Page</div>} />
              <Route path="/register" element={<div>Register Page</div>} />
              <Route path="/aggregator/*" element={<AggregatorDashboard />} />
              <Route path="/marketplace/*" element={<BuyerMarketplace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;


