import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AggregatorDashboard } from './pages/AggregatorDashboard'
import { BuyerMarketplace } from './pages/BuyerMarketplace'
import { Login } from './pages/Login'
import { useAuthStore } from './store/authStore'
import { Toaster } from './components/ui/sonner'
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const token = useAuthStore(state => state.token)
  const user = useAuthStore(state => state.user)
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}

export default function App() {
  const token = useAuthStore(state => state.token)
  const user = useAuthStore(state => state.user)
  
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={token && user ? <Navigate to={user.role === 'buyer' ? '/marketplace' : '/aggregator'} replace /> : <Login />} />
          
          <Route path="/aggregator" element={
            <ProtectedRoute allowedRoles={['admin', 'aggregator']}>
              <AggregatorDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/marketplace" element={
            <ProtectedRoute allowedRoles={['admin', 'buyer']}>
              <BuyerMarketplace />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  )
}
