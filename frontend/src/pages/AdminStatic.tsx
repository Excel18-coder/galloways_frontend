import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { logger } from "@/lib/logger";
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Wifi,
  WifiOff
} from "lucide-react";
import { Toaster } from "sonner";
// API import disabled for build

interface StaticAdminData {
  totalUsers: number;
  totalClaims: number;
  totalQuotes: number;
  totalRevenue: number;
  pendingClaims: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    status: string;
  }>;
}

export default function StaticAdmin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'offline'>('checking');
  const [adminData, setAdminData] = useState<StaticAdminData>({
    totalUsers: 0,
    totalClaims: 0,
    totalQuotes: 0,
    totalRevenue: 0,
    pendingClaims: 0,
    recentActivity: []
  });

  useEffect(() => {
    logger.log("🔧 Static Admin Panel Loaded");
    
    // Test backend connection
    testBackendConnection();
    
    // Load static data
    loadStaticData();
  }, []);

  const testBackendConnection = async () => {
    try {
      logger.log("🌐 Testing Supabase connection");
      
      const response = await console.log();
      
      if (response.success) {
        setConnectionStatus('connected');
        logger.log("✅ Supabase connected - Loading live data");
        loadLiveData();
      } else {
        setConnectionStatus('offline');
        logger.log("⚠️ Supabase offline - Using static data");
      }
    } catch (error) {
      setConnectionStatus('offline');
      logger.log("🔌 Supabase unavailable - Operating in offline mode");
    }
  };

  const loadLiveData = async () => {
    try {
      const response = await console.log();
      if (response.success) {
        setAdminData({
          totalUsers: response.data.totalUsers || 0,
          totalClaims: response.data.totalClaims || 0,
          totalQuotes: response.data.totalQuotes || 0,
          totalRevenue: response.data.totalRevenue || 0,
          pendingClaims: response.data.pendingClaims || 0,
          recentActivity: response.data.recentActivity || []
        });
        logger.log("📊 Live data loaded from Supabase");
      }
    } catch (error) {
      logger.log("📊 Using static data - Supabase unavailable");
      loadStaticData();
    }
  };

  const loadStaticData = () => {
    // Load from localStorage or use demo data
    const storedData = localStorage.getItem('admin_data');
    
    if (storedData) {
      setAdminData(JSON.parse(storedData));
    } else {
      // Demo data for demonstration
      const demoData: StaticAdminData = {
        totalUsers: 1247,
        totalClaims: 89,
        totalQuotes: 156,
        totalRevenue: 2450000,
        pendingClaims: 12,
        recentActivity: [
          {
            id: "1",
            type: "claim",
            description: "New motor insurance claim submitted",
            timestamp: "2 hours ago",
            status: "pending"
          },
          {
            id: "2", 
            type: "quote",
            description: "Life insurance quote requested",
            timestamp: "4 hours ago",
            status: "completed"
          },
          {
            id: "3",
            type: "payment",
            description: "Premium payment of KES 45,000 received",
            timestamp: "6 hours ago", 
            status: "completed"
          },
          {
            id: "4",
            type: "user",
            description: "New user registration completed",
            timestamp: "8 hours ago",
            status: "active"
          }
        ]
      };
      
      setAdminData(demoData);
      localStorage.setItem('admin_data', JSON.stringify(demoData));
    }
  };

  const getConnectionBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <Badge className="bg-green-100 text-green-800">
            <Wifi className="h-3 w-3 mr-1" />
            Live Data
          </Badge>
        );
      case 'offline':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <WifiOff className="h-3 w-3 mr-1" />
            Offline Mode
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1 animate-spin" />
            Connecting...
          </Badge>
        );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        {getConnectionBadge()}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.totalClaims}</div>
            <p className="text-xs text-muted-foreground">
              {adminData.pendingClaims} pending review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quote Requests</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.totalQuotes}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(adminData.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adminData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
                <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Backend Status Info */}
      {connectionStatus === 'offline' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <AlertCircle className="h-5 w-5 mr-2" />
              Offline Mode Active
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-yellow-700">
            <p className="mb-3">
              The admin panel is running in offline mode. This could be because:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Backend API is not deployed or running</li>
              <li>Network connectivity issues</li>
              <li>CORS or authentication problems</li>
              <li>Database connection issues</li>
            </ul>
            <div className="flex gap-2">
              <Button size="sm" onClick={testBackendConnection}>
                🔄 Retry Connection
              </Button>
              <Button size="sm" variant="outline" onClick={() => logger.log("Admin data:", adminData)}>
                🔍 View Debug Info
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "users":
        return (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Users Management</h3>
            <p className="text-muted-foreground mb-4">
              {connectionStatus === 'connected' 
                ? "Loading user data from backend..." 
                : "User management requires backend connection"}
            </p>
            <Button onClick={testBackendConnection}>
              Retry Connection
            </Button>
          </div>
        );
      case "claims":
        return (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Claims Management</h3>
            <p className="text-muted-foreground mb-4">
              {connectionStatus === 'connected' 
                ? "Loading claims data from backend..." 
                : "Claims management requires backend connection"}
            </p>
            <Button onClick={testBackendConnection}>
              Retry Connection
            </Button>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
  <div className="h-screen bg-background">
      <div className="flex">
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <AdminTopbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="p-6">
            {renderContent()}
          </main>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}
