import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Hardcoded credentials
  const ADMIN_EMAIL = "williamanalo62@gmail.com";
  const ADMIN_PASSWORD = "Galloways@2025";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate a brief loading delay for better UX
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Store admin session
        localStorage.setItem("admin_authenticated", "true");
        localStorage.setItem("admin_token", "admin-access-token");
        localStorage.setItem("admin_login_time", new Date().toISOString());
        
        toast.success("Login successful! Welcome to admin dashboard.");
        onLogin();
      } else {
        setError("Invalid email or password. Please check your credentials.");
        toast.error("Login failed. Invalid credentials.");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/30 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      {/* Company Logo/Branding - Fixed position without overlap */}
      <div className="absolute top-6 left-6 flex items-center space-x-3 z-20">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
          <span className="text-lg font-bold text-white">G</span>
        </div>
        <div className="text-white">
          <h2 className="text-base font-bold">Galloways</h2>
          <p className="text-xs text-gray-300">Insurance Agencies & Consultancy</p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex items-center justify-center min-h-screen px-4 py-20">
        {/* Login Card */}
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0 relative z-10">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-800 leading-tight">
            Galloways Insurance Agencies &<br />
            Consultancy Services Admin Portal
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm mt-2">
            Access is restricted to authorized administrators only.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* Admin Portal Features */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3 text-sm">Admin Portal Features</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Lead & Client Management: Track, update, and follow up on leads.</li>
              <li>• Admin Work Tracking: Productivity stats, conversion reports, revenue.</li>
              <li>• Insurance Policy Oversight: View, review, and endorse policies.</li>
              <li>• Claims Oversight: Track claims, audit logs, and data reports.</li>
              <li>• Payments & Revenue Tracking: View payments, breakdowns, export reports.</li>
              <li>• Communication Tools: Internal notes, notifications, reminders.</li>
              <li>• Resource Library: Policy docs, training, compliance, scripts.</li>
              <li>• User Management: Admin roles, assignments, performance.</li>
              <li>• Analytics & Reporting: KPIs, charts, ratios, growth.</li>
              <li>• Secure Login: Only authorized admin email and password can access.</li>
            </ul>
          </div>

          <div className="text-center text-xs text-gray-500 mt-4">
            <p>
              <strong>In short:</strong> The Resources (Admin Portal) acts as the command center for the 
              insurance agency — letting admins manage leads, sales, renewals, claims, 
              payments, and their own productivity, while providing internal resources & 
              reports.
            </p>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Footer - Fixed at bottom without overlap */}
      <div className="absolute bottom-4 left-0 right-0 z-10">
        <div className="text-center text-white/80 px-4">
          <h3 className="text-sm font-semibold">Galloways</h3>
          <p className="text-xs text-white/60 max-w-2xl mx-auto">
            Professional insurance agency and consultancy services, managing risk 
            and arranging insurance solutions tailored to customers' needs.
          </p>
        </div>
      </div>
    </div>
  );
}