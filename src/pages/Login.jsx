import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, ref } from "firebase/database";
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Eye, EyeOff } from 'lucide-react';
import { realtimeDb } from "@/lib/firebase";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (value) => {
    // Simple email regex for format validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!value) {
      setEmailError('');
    } else if (!validateEmail(value)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let found = false;
    let userData = null;

    // Check for admin credentials first
    if (email === "admin@gmail.com" && password === "admin") {
      userData = {
        email,
        role: "admin",
        name: "Admin User"
        // no department field!
      };
      found = true;
    } else {
      try {
        // Fetch all department_heads
        const headsRef = ref(realtimeDb, "department_heads");
        const snap = await get(headsRef);

        if (snap.exists()) {
          const departments = snap.val();
          for (const dept in departments) {
            for (const headId in departments[dept]) {
              const head = departments[dept][headId];
              if (head.email === email && head.password === password) {
                found = true;
                userData = head;
                break;
              }
            }
            if (found) break;
          }
        }
      } catch (err) {
        toast({
          title: "Login error",
          description: "Could not connect to database.",
          variant: "destructive"
        });
      }
    }

    if (found && userData) {
      useAuthStore.setState({
        user: userData,
        isAuthenticated: true,
        isLoading: false
      });
      toast({
        title: "Login successful",
        description: userData.role === "admin"
          ? "Welcome, Admin!"
          : `Welcome, Department Head (${userData.department})!`,
      });
      navigate("/dashboard"); // <-- Redirect to Dashboard after login
    } else {
      toast({
        title: "Invalid credentials",
        description: "Email or password is incorrect.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">CivicTracker</span>
          </div>
          <p className="text-muted-foreground">Municipal Administration Portal</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-card bg-[#f6f6f6]">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  autoFocus
                  onBlur={() => {
                    if (email && !validateEmail(email)) setEmailError('Please enter a valid email address.');
                    else setEmailError('');
                  }}
                />
                {emailError && (
                  <span className="text-red-600 text-xs">{emailError}</span>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={!!emailError}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    style={{ color: "#333" }}
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={!!emailError}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !!emailError}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo Credentials */}
            {/* <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Demo credentials:</p>
              <p className="text-sm font-mono">Email: admin</p>
              <p className="text-sm font-mono">Password: admin</p>
            </div> */}
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}