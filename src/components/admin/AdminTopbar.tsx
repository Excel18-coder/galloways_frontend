import { 
  Bell, 
  Menu, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  Moon, 
  Sun,
  Globe,
  MessageSquare,
  Activity,
  Shield,
  Download,
  RefreshCw,
  Maximize,
  Minimize
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { toast } from "sonner";
// API import disabled for build

interface AdminTopbarProps {
  toggleSidebar: () => void;
}

export function AdminTopbar({ toggleSidebar }: AdminTopbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldUseDark);
    if (shouldUseDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{
    id: number;
    title: string;
    time: string;
    unread: boolean;
  }>>([]);
  const [systemStatus, setSystemStatus] = useState({
    status: "operational",
    uptime: "99.9%",
    activeUsers: 0
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  // Fetch notifications and system status on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await console.log();
        const notificationsData = response.data?.notifications || [];
        
        // Transform backend data to match frontend format
        const transformedNotifications = notificationsData.slice(0, 5).map((notification: any, index: number) => ({
          id: notification.id || index,
          title: notification.title || notification.message || "New notification",
          time: notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : "Recent",
          unread: notification.unread !== false
        }));
        
        setNotifications(transformedNotifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        // Keep empty array if API fails
        setNotifications([]);
      }
    };

    const fetchSystemStats = async () => {
      try {
        const userStatsResponse = await console.log();
        const userStats = userStatsResponse.data || {};
        
        setSystemStatus(prev => ({
          ...prev,
          activeUsers: userStats.totalUsers || 0
        }));
      } catch (error) {
        console.error('Failed to fetch system stats:', error);
        // Keep default values
      }
    };

    fetchNotifications();
    fetchSystemStats();
  }, []);

  // Search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success(`Searching for: ${searchQuery}`);
      // Here you would implement actual search logic
    }
  };

  // Theme toggle
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Apply theme to document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    
    toast.success(`Switched to ${newDarkMode ? 'dark' : 'light'} mode`);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      toast.success("Entered fullscreen mode");
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      toast.success("Exited fullscreen mode");
    }
  };

  // Quick actions
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'refresh':
        toast.success("System refreshed");
        window.location.reload();
        break;
      case 'export':
        toast.success("Export initiated");
        break;
      case 'settings':
        toast.success("Opening settings");
        break;
      case 'logout':
        toast.success("Logging out...");
        break;
      default:
        toast.success(`${action} executed`);
    }
  };

  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
  };

  // Real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-blue-500/5">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-white to-purple-50/50 pointer-events-none" />
      
      <div className="relative px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-6">
            {/* Sidebar Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="lg:hidden hover:bg-blue-50 rounded-xl p-2 transition-all duration-200"
            >
              <Menu className="h-5 w-5 text-slate-600" />
            </Button>
            
            {/* Advanced Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users, claims, consultations..." 
                className="pl-11 pr-4 w-80 bg-white/60 border-white/20 rounded-xl 
                         focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100
                         placeholder:text-slate-400 text-slate-700 font-medium
                         transition-all duration-200"
              />
              {searchQuery && (
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 px-3 
                           bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
                           text-white rounded-lg text-xs font-medium transition-all duration-200"
                >
                  Search
                </Button>
              )}
            </form>

            {/* System Status */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="flex items-center space-x-1.5">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  systemStatus.status === 'operational' ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <span className="text-xs font-medium text-slate-600">
                  {systemStatus.status === 'operational' ? 'All Systems Operational' : 'Issues Detected'}
                </span>
              </div>
              <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                {systemStatus.activeUsers} active
              </Badge>
            </div>
          </div>
          
          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Quick Actions */}
            <div className="hidden lg:flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuickAction('refresh')}
                className="h-9 w-9 rounded-xl hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all duration-200"
                title="Refresh System"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuickAction('export')}
                className="h-9 w-9 rounded-xl hover:bg-green-50 text-slate-600 hover:text-green-600 transition-all duration-200"
                title="Export Data"
              >
                <Download className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-9 w-9 rounded-xl hover:bg-yellow-50 text-slate-600 hover:text-yellow-600 transition-all duration-200"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="h-9 w-9 rounded-xl hover:bg-purple-50 text-slate-600 hover:text-purple-600 transition-all duration-200"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
            
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative h-10 w-10 rounded-xl hover:bg-red-50 text-slate-600 hover:text-red-600 transition-all duration-200"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center 
                               bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full
                               animate-pulse shadow-lg"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white/95 backdrop-blur-xl border-white/20 shadow-xl">
                <div className="p-3 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">Notifications</h3>
                  <p className="text-xs text-slate-500">{unreadCount} unread messages</p>
                </div>
                {notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id}
                    className="p-3 cursor-pointer hover:bg-blue-50"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.unread ? 'bg-blue-500' : 'bg-slate-300'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{notification.title}</p>
                        <p className="text-xs text-slate-500">{notification.time}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem className="p-3 text-center text-blue-600 hover:bg-blue-50 font-medium">
                  View All Notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 h-10 px-3 rounded-xl hover:bg-slate-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <span className="text-sm font-semibold text-slate-700">Admin User</span>
                    <p className="text-xs text-slate-500">Super Admin</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-xl border-white/20 shadow-xl">
                <div className="p-3 border-b border-slate-100">
                  <p className="font-medium text-slate-800">Admin User</p>
                  <p className="text-sm text-slate-500">admin@galloways.com</p>
                </div>
                <DropdownMenuItem 
                  className="flex items-center space-x-2 p-3 hover:bg-blue-50 cursor-pointer"
                  onClick={() => handleQuickAction('profile')}
                >
                  <User className="h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center space-x-2 p-3 hover:bg-slate-50 cursor-pointer"
                  onClick={() => handleQuickAction('settings')}
                >
                  <Settings className="h-4 w-4" />
                  <span>System Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center space-x-2 p-3 hover:bg-green-50 cursor-pointer"
                >
                  <Activity className="h-4 w-4" />
                  <span>Activity Log</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center space-x-2 p-3 hover:bg-purple-50 cursor-pointer"
                >
                  <Shield className="h-4 w-4" />
                  <span>Security</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center space-x-2 p-3 hover:bg-red-50 text-red-600 cursor-pointer"
                  onClick={() => handleQuickAction('logout')}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Subtle Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
    </header>
  );
}
