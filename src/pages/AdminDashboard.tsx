import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminDashboard as AdminDashboardComponent } from "@/components/admin/AdminDashboard";
import { AdminClaims } from "@/components/admin/AdminClaims";
import { AdminConsultations } from "@/components/admin/AdminConsultations";
import { AdminQuotes } from "@/components/admin/AdminQuotes";
import { AdminDiaspora } from "@/components/admin/AdminDiaspora";
import { AdminOutsourcing } from "@/components/admin/AdminOutsourcing";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminPayments } from "@/components/admin/AdminPayments";


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for admin access - in development, allow access for testing
    const hasAdminAccess = localStorage.getItem("admin_token") || 
                          localStorage.getItem("auth_token") || 
                          process.env.NODE_ENV === 'development';
    
    if (!hasAdminAccess) {
      navigate("/auth");
      return;
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-7xl mx-auto shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="text-3xl font-bold">Admin Dashboard</CardTitle>
            <p className="text-blue-100">Manage your insurance platform</p>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-8 mb-6">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="claims">Claims</TabsTrigger>
                <TabsTrigger value="consultations">Consultations</TabsTrigger>
                <TabsTrigger value="quotes">Quotes</TabsTrigger>
                <TabsTrigger value="diaspora">Diaspora</TabsTrigger>
                <TabsTrigger value="outsourcing">Outsourcing</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="space-y-4">
                <AdminDashboardComponent />
              </TabsContent>
            
            <TabsContent value="claims" className="space-y-4">
              <AdminClaims />
            </TabsContent>
            
            <TabsContent value="consultations" className="space-y-4">
              <AdminConsultations />
            </TabsContent>
            
            <TabsContent value="quotes" className="space-y-4">
              <AdminQuotes />
            </TabsContent>
            
            <TabsContent value="diaspora" className="space-y-4">
              <AdminDiaspora />
            </TabsContent>
            
            <TabsContent value="outsourcing" className="space-y-4">
              <AdminOutsourcing />
            </TabsContent>
            
            <TabsContent value="users" className="space-y-4">
              <AdminUsers />
            </TabsContent>
            
            <TabsContent value="payments" className="space-y-4">
              <AdminPayments />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
