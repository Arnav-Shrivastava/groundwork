import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Leaf } from "lucide-react"
import { useAuthStore } from "../store/authStore"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "../components/ui/label"

export function Login() {
  const [email, setEmail] = useState("admin@groundwork.earth")
  const [password, setPassword] = useState("Admin@123")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const setToken = useAuthStore((state) => state.setToken)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const formData = new URLSearchParams()
      formData.append("username", email)
      formData.append("password", password)

      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      })

      if (!response.ok) {
        throw new Error("Invalid credentials")
      }

      const data = await response.json()
      setToken(data.access_token)
      
      // Fetch user profile to route correctly
      const meResponse = await fetch("http://localhost:8000/api/auth/me", {
        headers: {
          "Authorization": `Bearer ${data.access_token}`
        }
      })
      const user = await meResponse.json()
      useAuthStore.getState().setUser(user)
      
      if (user.role === "aggregator" || user.role === "admin") {
        navigate("/aggregator")
      } else {
        navigate("/marketplace")
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Leaf className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">GroundWork OS</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <Card className="bg-card shadow-lg border-border">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your email and password below</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && <div className="p-3 text-sm bg-destructive/20 text-destructive-foreground rounded-md border border-destructive/50">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
