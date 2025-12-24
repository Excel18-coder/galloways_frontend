import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Bell, 
  BarChart3, 
  Settings,
  Menu,
  X,
  FileText,
  Calendar,
  Sparkles,
  Shield,
  Crown,
  MessageSquare,
  Globe,
  Briefcase,
  FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import styles from "./AdminSidebar.module.css";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "System Overview",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    description: "User Management",
    color: "from-green-500 to-green-600",
  },
  {
    id: "claims",
    label: "Claims",
    icon: FileText,
    description: "Claims Processing",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "quotes",
    label: "Quotes",
    icon: MessageSquare,
    description: "Quote Management",
    color: "from-blue-500 to-purple-600",
  },
  {
    id: "diaspora",
    label: "Diaspora",
    icon: Globe,
    description: "Diaspora Requests",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "outsourcing",
    label: "Outsourcing",
    icon: Briefcase,
    description: "Outsourcing Requests",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "consultations",
    label: "Consultations",
    icon: Calendar,
    description: "Normal Consultation",
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "consultations-booking",
    label: "Booked Consultation",
    icon: Calendar,
    description: "Booking Management",
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "payments",
    label: "Payments",
    icon: CreditCard,
    description: "Financial Overview",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "System Alerts",
    color: "from-red-500 to-red-600",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    description: "Data Insights",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    id: "resources",
    label: "Resources",
    icon: FolderOpen,
    description: "File Management",
    color: "from-teal-500 to-teal-600",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    description: "System Config",
    color: "from-slate-500 to-slate-600",
  },
];

export function AdminSidebar({ activeTab, setActiveTab, isOpen, toggleSidebar }: AdminSidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <>
      {/* Mobile backdrop with glassmorphism */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden animate-in fade-in duration-300" 
          onClick={toggleSidebar} 
        />
      )}
      
      {/* Advanced Sidebar with Glass Morphism */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 
        bg-white/95 backdrop-blur-xl border-r border-white/20
        shadow-2xl shadow-blue-500/10
        transform transition-all duration-500 ease-out
        lg:translate-x-0 lg:static lg:inset-0
        before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/50 before:to-white/30 before:pointer-events-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header with Advanced Styling */}
        <div className="relative flex items-center justify-between h-20 px-6 border-b border-white/10 bg-gradient-to-r from-blue-600/5 to-purple-600/5">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-xs text-slate-500 font-medium">Enterprise Suite</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden hover:bg-white/20 rounded-xl p-2 transition-all duration-200"
          >
            <X className="h-5 w-5 text-slate-600" />
          </Button>
        </div>
        
        {/* Navigation with Advanced Hover Effects and Scrollable */}
        <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto max-h-[calc(100vh-12rem)] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isHovered = hoveredItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`
                  group relative w-full flex items-center px-4 py-4 text-sm font-semibold rounded-2xl 
                  transition-all duration-300 ease-out transform
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-lg shadow-blue-500/20 scale-105 translate-x-1'
                    : isHovered 
                      ? 'bg-white/60 text-slate-700 shadow-md shadow-slate-500/10 scale-102 translate-x-0.5'
                      : 'text-slate-600 hover:bg-white/40'
                  }
                  ${`delay-${index}`}
                `}
              >
                {/* Icon with Gradient Background */}
                <div className={`
                  relative mr-4 p-2 rounded-xl transition-all duration-300
                  ${isActive 
                    ? `bg-gradient-to-br ${item.color} shadow-lg shadow-blue-500/25` 
                    : isHovered 
                      ? `bg-gradient-to-br ${item.color} shadow-md shadow-slate-500/20`
                      : 'bg-slate-100 group-hover:bg-slate-200'
                  }
                `}>
                  <Icon className={`h-5 w-5 transition-all duration-300 ${
                    isActive || isHovered ? 'text-white' : 'text-slate-600'
                  }`} />
                  
                  {/* Active Indicator Pulse */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 animate-pulse" />
                  )}
                </div>
                
                <div className="flex-1 text-left">
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-xs opacity-70 font-normal">{item.description}</div>
                </div>
                
                {/* Hover Indicator */}
                {isHovered && !isActive && (
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
                )}
                
                {/* Active Indicator */}
                {isActive && (
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full shadow-lg" />
                )}
                
                {/* Ripple Effect on Click */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className={`
                    absolute inset-0 bg-gradient-to-r from-blue-400/0 to-purple-400/0 
                    group-active:from-blue-400/20 group-active:to-purple-400/20
                    transition-all duration-200
                  `} />
                </div>
              </button>
            );
          })}
        </nav>
        
        {/* Footer with Advanced Styling */}
        <div className="relative p-6 border-t border-white/10 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium text-slate-600">System Secure</span>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div className="text-xs text-slate-500 font-medium mb-1">
            Galloways Admin Suite v2.0
          </div>
          <div className="text-xs text-slate-400">
            Enterprise Edition
          </div>
          
          {/* Status Indicator */}
          <div className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg animate-pulse" />
        </div>
        
        {/* Ambient Glow Effects */}
        <div className="absolute top-20 left-0 w-full h-32 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-full h-32 bg-gradient-to-t from-purple-500/5 to-transparent pointer-events-none" />
      </div>
    </>
  );
}
