import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";


const Index = lazy(() => import("./pages/Index"));
const Products = lazy(() => import("./pages/Products"));
const Claims = lazy(() => import("./pages/Claims"));
const Diaspora = lazy(() => import("./pages/Diaspora"));
const Consultancy = lazy(() => import("./pages/Consultancy"));
import Quotes from "./pages/Quotes";
const Outsourcing = lazy(() => import("./pages/Outsourcing"));
const Payment = lazy(() => import("./pages/Payment"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailure = lazy(() => import("./pages/PaymentFailure"));
const PaymentCallback = lazy(() => import("./pages/PaymentCallback"));
const Auth = lazy(() => import("./pages/Auth"));
const Resources = lazy(() => import("./pages/Resources"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (was cacheTime)
    },
  },
});

function App() {
  // Test Laravel backend connection on app start
  useEffect(() => {
    const initBackend = async () => {
      try {
        console.log('🔧 Testing Laravel backend connection...');

        // Test Laravel API connection
        const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Laravel backend connected successfully!', data);
        } else {
          console.warn('⚠️ Laravel backend connection issue - using fallback mode');
        }
      } catch (error) {
        console.warn('⚠️ Backend connection error:', error);
        console.log('🔄 Using offline mode with demo data');
      }
    };

    initBackend();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/claims" element={<Claims />} />
              <Route path="/diaspora" element={<Diaspora />} />
              <Route path="/consultancy" element={<Consultancy />} />
              <Route path="/quotes" element={<Quotes  />} />
              <Route path="/outsourcing" element={<Outsourcing />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/failure" element={<PaymentFailure />} />
              <Route path="/payment/callback" element={<PaymentCallback />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/resources" element={<Resources />} />
             
              <Route path="/admin/*" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
