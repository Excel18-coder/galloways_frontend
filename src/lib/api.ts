/// <reference types="vite/client" />
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
const DEBUG = import.meta.env.VITE_DEBUG === 'true' || true; // Force debug for now

// Enhanced helper for HTTP requests with better error handling
async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  if (DEBUG) {
    console.log(`API Request: ${options.method || 'GET'} ${url}`);
    if (options.body) {
      console.log('Request body:', options.body);
    }
  }

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'omit',
      ...options,
    });

    if (DEBUG) {
      console.log(`API Response: ${res.status} ${res.statusText}`);
    }

    // Handle different response types
    const contentType = res.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      // For non-JSON responses (like file downloads)
      data = await res.text();
    }

    if (!res.ok) {
      const errorMessage = data?.message || data?.error || `HTTP ${res.status}: ${res.statusText}`;
      if (DEBUG) {
        console.error('API Error:', errorMessage);
      }
      throw new Error(errorMessage);
    }

    if (DEBUG) {
      console.log('API Success:', data);
    }

    return data;
  } catch (error: any) {
    if (DEBUG) {
      console.error('API Request failed:', error);
    }
    
    // Return a standardized error response
    return {
      success: false,
      error: error.message || 'Network error - could not connect to server',
      data: null
    };
  }
}

// Claims Service - Enhanced for PostgreSQL backend
const claimsService = {
  createClaim: async (formData: any) => {
    try {
      let body;
      let headers: any = {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      };

      // Handle FormData (with file uploads) vs regular objects
      if (formData instanceof FormData) {
        body = formData;
        // Don't set Content-Type for FormData - let browser set it with boundary
      } else {
        // Ensure the body is always a JSON object
        body = JSON.stringify(
          formData && typeof formData === 'object' && !Array.isArray(formData)
            ? (formData.entries ? Object.fromEntries(formData.entries()) : formData)
            : {}
        );
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(`${API_BASE_URL}/claims`, {
        method: 'POST',
        headers,
        body,
        // mode: 'cors',
        // credentials: 'omit',
      });

      const contentType = response.headers.get('content-type');
      let data: any = null;
      try {
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          data = text ? { message: text } : null;
        }
      } catch (_) {
        data = null;
      }

      if (DEBUG) {
        console.log('CreateClaim response raw:', { status: response.status, data });
      }

      const success = response.ok && !(data && (data.error || data.success === false));
      let message = (data && (data.message || data.error)) || '';
      if (!message && data && Array.isArray((data as any).message)) {
        message = (data as any).message.join('\n');
      }
      if (!message && data && data.errors && typeof data.errors === 'object') {
        const parts: string[] = [];
        for (const [field, errs] of Object.entries<any>(data.errors)) {
          if (Array.isArray(errs)) parts.push(`${field}: ${errs.join(', ')}`);
          else if (typeof errs === 'string') parts.push(`${field}: ${errs}`);
        }
        if (parts.length) message = parts.join('\n');
      }
      if (!message) {
        message = response.ok ? 'Claim submitted successfully' : 'Failed to create claim';
      }
      
      return {
        success,
        data: data && (data.data ?? data) || null,
        message,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to submit claim'
      };
    }
  },

  getClaims: async () => {
    try {
      const response = await request('/claims');
      return {
        success: !response.error,
        data: response.error ? [] : (response.data || response || []),
        message: response.error || 'Claims loaded successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to load claims'
      };
    }
  },

  getClaim: async (id: string) => {
    try {
      const response = await request(`/claims/${id}`);
      return {
        success: !response.error,
        data: response.error ? null : (response.data || response),
        message: response.error || 'Claim loaded successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to load claim'
      };
    }
  },

  updateClaimStatus: async (id: string, status: string) => {
    try {
      const response = await request(`/claims/${id}/status`, { 
        method: 'PUT', 
        body: JSON.stringify({ status }) 
      });
      return {
        success: !response.error,
        data: response.error ? null : response,
        message: response.error || 'Claim status updated successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to update claim status'
      };
    }
  },
};

// Quotes Service - Enhanced for PostgreSQL backend
const quotesService = {
  createQuote: async (formData: any) => {
    try {
      let body;
      let headers: any = {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      };

      if (formData instanceof FormData) {
        body = formData;
      } else {
        body = JSON.stringify(formData.entries ? Object.fromEntries(formData.entries()) : formData);
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(`${API_BASE_URL}/quotes`, {
        method: 'POST',
        headers,
        body,
        mode: 'cors',
        credentials: 'omit',
      });

      const contentType = response.headers.get('content-type');
      let data: any = null;
      try {
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          data = text ? { message: text } : null;
        }
      } catch (_) {
        data = null;
      }

      const success = response.ok && !(data && (data.error || data.success === false));
      const message =
        (data && (data.message || data.error)) ||
        (response.ok ? 'Quote request submitted successfully' : `Failed to submit quote request (HTTP ${response.status})`);
      
      return {
        success,
        data: data && (data.data ?? data) || null,
        message,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to submit quote request'
      };
    }
  },

  getQuotes: async () => {
    try {
      const response = await request('/quotes');
      return {
        success: !response.error,
        data: response.error ? [] : (response.data || response || []),
        message: response.error || 'Quotes loaded successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to load quotes'
      };
    }
  },

  getQuote: async (id: string) => {
    try {
      const response = await request(`/quotes/${id}`);
      return {
        success: !response.error,
        data: response.error ? null : (response.data || response),
        message: response.error || 'Quote loaded successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to load quote'
      };
    }
  },
};

// Payments Service
const paymentsService = {
  createPayment: async (data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get('content-type');
      let responseData: any = null;
      try {
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          const text = await response.text();
          responseData = text ? { message: text } : null;
        }
      } catch (_) {
        responseData = null;
      }

      if (DEBUG) {
        console.log('CreatePayment response raw:', { status: response.status, data: responseData });
      }

      const success = response.ok && !(responseData && (responseData.error || responseData.success === false));
      let message = (responseData && (responseData.message || responseData.error)) || '';
      if (!message && responseData && Array.isArray((responseData as any).message)) {
        message = (responseData as any).message.join('\n');
      }
      if (!message && responseData && responseData.errors && typeof responseData.errors === 'object') {
        const parts: string[] = [];
        for (const [field, errs] of Object.entries<any>(responseData.errors)) {
          if (Array.isArray(errs)) parts.push(`${field}: ${errs.join(', ')}`);
          else if (typeof errs === 'string') parts.push(`${field}: ${errs}`);
        }
        if (parts.length) message = parts.join('\n');
      }
      if (!message) {
        message = response.ok ? 'Payment initialized successfully' : 'Failed to create payment';
      }

      return {
        success,
        data: responseData && (responseData.data ?? responseData) || null,
        message,
        error: responseData?.error || null,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to create payment',
        error: error.message,
      };
    }
  },
  verifyPayment: async (reference: string) => {
    try {
      const params = new URLSearchParams();
      params.set('reference', reference);
      params.set('provider', 'paystack');
      
      const res = await fetch(`${API_BASE_URL}/payments/callback?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      
      const contentType = res.headers.get('content-type');
      let data: any = null;
      try {
        if (contentType && contentType.includes('application/json')) {
          data = await res.json();
        } else {
          const text = await res.text();
          data = text ? { message: text } : null;
        }
      } catch {
        data = null;
      }
      
      if (DEBUG) {
        console.log('VerifyPayment response:', { status: res.status, data });
      }
      
      if (res.ok) {
        return { 
          success: true, 
          data: data?.data ?? data ?? null, 
          message: data?.message || 'Payment verified' 
        };
      } else {
        return { 
          success: false, 
          error: data?.error || data?.message || `HTTP ${res.status}`, 
          data: data?.data ?? null 
        };
      }
    } catch (err: any) {
      if (DEBUG) console.error('VerifyPayment error:', err);
      return { 
        success: false, 
        error: err.message || 'Network error during verification', 
        data: null 
      };
    }
  },
  initiateSTKPush: async (data: any) => request('/payments/mpesa', { method: 'POST', body: JSON.stringify(data) }),
};

// Outsourcing Service
const outsourcingService = {
  createOutsourcingRequest: async (data: any) => request('/outsourcing-requests', { method: 'POST', body: JSON.stringify(data) }),
  getOutsourcingRequests: async () => request('/outsourcing-requests', { method: 'GET' }),
};

// Diaspora Service
const diasporaService = {
  createDiasporaRequest: async (data: any) => request('/diaspora-requests', { method: 'POST', body: JSON.stringify(data) }),
  getDiasporaRequests: async () => request('/diaspora-requests', { method: 'GET' }),
};

// Consultations Service
const consultationsService = {
  createConsultation: async (data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get('content-type');
      let responseData: any = null;
      try {
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          const text = await response.text();
          responseData = text ? { message: text } : null;
        }
      } catch (_) {
        responseData = null;
      }

      if (DEBUG) {
        console.log('CreateConsultation response raw:', { status: response.status, data: responseData });
      }

      const success = response.ok && !(responseData && (responseData.error || responseData.success === false));
      let message = (responseData && (responseData.message || responseData.error)) || '';
      if (!message && responseData && Array.isArray((responseData as any).message)) {
        message = (responseData as any).message.join('\n');
      }
      if (!message && responseData && responseData.errors && typeof responseData.errors === 'object') {
        const parts: string[] = [];
        for (const [field, errs] of Object.entries<any>(responseData.errors)) {
          if (Array.isArray(errs)) parts.push(`${field}: ${errs.join(', ')}`);
          else if (typeof errs === 'string') parts.push(`${field}: ${errs}`);
        }
        if (parts.length) message = parts.join('\n');
      }
      if (!message) {
        message = response.ok ? 'Consultation created successfully' : 'Failed to create consultation';
      }

      return {
        success,
        data: responseData && (responseData.data ?? responseData) || null,
        message,
        error: responseData?.error || null,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to create consultation',
        error: error.message,
      };
    }
  },
  getConsultations: async () => request('/consultations', { method: 'GET' }),
  getConsultation: async (id: string) => request(`/consultations/${id}`, { method: 'GET' }),
  updateConsultationStatus: async (id: string, status: string) => request(`/consultations/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  testConnection: async () => request('/consultations/test', { method: 'GET' }),
};

// Auth Service
const authService = {
  login: async (data: { email: string; password: string }) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: async (data: { fullName: string; email: string; password: string }) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  logout: async () => request('/auth/logout', { method: 'POST' }),
  getProfile: async () => request('/auth/profile', { method: 'GET' }),
};

// Resources Service
const resourcesService = {
  getResources: async () => request('/resources', { method: 'GET' }),
  downloadResource: async (id: string) => request(`/resources/${id}/download`, { method: 'GET' }),
  uploadResource: async (formData: FormData) => {
    const body = JSON.stringify(Object.fromEntries(formData.entries ? formData.entries() : Object.entries(formData)));
    return request('/resources', { method: 'POST', body });
  },
};

// Dashboard Service - Enhanced for PostgreSQL backend
const dashboardService = {
  getStats: async () => {
    try {
      const response = await request('/dashboard/stats');
      return {
        success: !response.error,
        data: response.error ? {} : response,
        message: response.error || 'Dashboard stats loaded successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: {},
        message: error.message || 'Failed to load dashboard stats'
      };
    }
  },

  getActivities: async () => {
    try {
      const response = await request('/dashboard/activities');
      return {
        success: !response.error,
        data: response.error ? [] : (response.data || response || []),
        message: response.error || 'Activities loaded successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to load activities'
      };
    }
  },

  getTopStats: async () => {
    try {
      const response = await request('/dashboard/top-stats');
      return {
        success: !response.error,
        data: response.error ? {} : response,
        message: response.error || 'Top stats loaded successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: {},
        message: error.message || 'Failed to load top stats'
      };
    }
  },
};

// Admin Service - Enhanced for PostgreSQL/cPanel backend
const adminService = {
  // System Health Check
  getSystemHealth: async () => {
    try {
      const response = await request('/admin/health');
      return {
        success: !response.error,
        data: response.error ? null : response,
        message: response.error || 'System health check completed'
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to check system health'
      };
    }
  },

  getSystemMetrics: async () => {
    try {
      const response = await request('/admin/metrics');
      if (response.error) {
        return {
          success: false,
          data: {
            totalUsers: 0,
            totalClaims: 0,
            totalConsultations: 0,
            totalPayments: 0,
            totalQuotes: 0,
            totalOutsourcingRequests: 0,
            totalDiasporaRequests: 0,
            totalRevenue: 0,
            monthlyRevenue: 0,
            conversionRate: 0,
            userGrowthRate: 0,
            claimsGrowthRate: 0,
            quoteGrowthRate: 0,
            revenueGrowthRate: 0,
            lastUpdated: new Date().toISOString()
          },
          message: response.error
        };
      }
      return {
        success: true,
        data: response.data || response,
        message: 'Metrics loaded successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: {
          totalUsers: 0,
          totalClaims: 0,
          totalConsultations: 0,
          totalPayments: 0,
          totalQuotes: 0,
          totalOutsourcingRequests: 0,
          totalDiasporaRequests: 0,
          totalRevenue: 0,
          monthlyRevenue: 0,
          conversionRate: 0,
          userGrowthRate: 0,
          claimsGrowthRate: 0,
          quoteGrowthRate: 0,
          revenueGrowthRate: 0,
          lastUpdated: new Date().toISOString()
        },
        message: error.message || 'Failed to load metrics'
      };
    }
  },

  getRecentActivities: async (limit = 50) => {
    try {
      const response = await request(`/admin/activities?limit=${limit}`);
      return {
        success: !response.error,
        data: response.error ? [] : (response.data || response || []),
        message: response.error || 'Activities loaded successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to load activities'
      };
    }
  },
  
  // Users
  getAllUsers: async (page = 1, limit = 50) => request(`/admin/users?page=${page}&limit=${limit}`, { method: 'GET' }),
  getUserStats: async () => request('/admin/users/stats', { method: 'GET' }),
  updateUserStatus: async (id: number, status: string) => request(`/admin/users/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  
  // Claims Management
  getAllClaims: async (page = 1, limit = 50, status?: string, search?: string) => {
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (status && status !== 'all') params.append('status', status);
      if (search) params.append('search', search);
      
      const response = await request(`/admin/claims?${params.toString()}`);
      return {
        success: !response.error,
        data: response.error ? { claims: [], pagination: { totalPages: 1, currentPage: 1, total: 0 } } : response,
        message: response.error || 'Claims loaded successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: { claims: [], pagination: { totalPages: 1, currentPage: 1, total: 0 } },
        message: error.message || 'Failed to load claims'
      };
    }
  },

  getClaimById: async (id: number) => {
    try {
      const response = await request(`/admin/claims/${id}`);
      return {
        success: !response.error,
        data: response.error ? null : (response.data || response),
        message: response.error || 'Claim loaded successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to load claim'
      };
    }
  },

  getClaimsStats: async () => {
    try {
      const response = await request('/admin/claims/stats');
      return {
        success: !response.error,
        data: response.error ? { total: 0, pending: 0, approved: 0, rejected: 0 } : response,
        message: response.error || 'Claims stats loaded successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: { total: 0, pending: 0, approved: 0, rejected: 0 },
        message: error.message || 'Failed to load claims stats'
      };
    }
  },

  updateClaimStatus: async (id: number, status: string) => {
    try {
      const response = await request(`/admin/claims/${id}/status`, { 
        method: 'PUT', 
        body: JSON.stringify({ status }) 
      });
      return {
        success: !response.error,
        data: response.error ? null : response,
        message: response.error || 'Claim status updated successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to update claim status'
      };
    }
  },
  
  // Consultations
  getAllConsultations: async (page = 1, limit = 50, status?: string, search?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    return request(`/admin/consultations?${params.toString()}`, { method: 'GET' });
  },
  getConsultationById: async (id: number) => request(`/admin/consultations/${id}`, { method: 'GET' }),
  updateConsultationStatus: async (id: number, status: string) => request(`/admin/consultations/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  
  // Quotes
  getAllQuotes: async (page = 1, limit = 50) => request(`/admin/quotes?page=${page}&limit=${limit}`, { method: 'GET' }),
  getQuoteById: async (id: number) => request(`/admin/quotes/${id}`, { method: 'GET' }),
  updateQuoteStatus: async (id: number, status: string) => request(`/admin/quotes/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  
  // Diaspora
  getAllDiasporaRequests: async (page = 1, limit = 50) => request(`/admin/diaspora?page=${page}&limit=${limit}`, { method: 'GET' }),
  getDiasporaById: async (id: number) => request(`/admin/diaspora/${id}`, { method: 'GET' }),
  updateDiasporaStatus: async (id: number, status: string) => request(`/admin/diaspora/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  
  // Outsourcing
  getAllOutsourcingRequests: async (page = 1, limit = 50) => request(`/admin/outsourcing?page=${page}&limit=${limit}`, { method: 'GET' }),
  getOutsourcingById: async (id: number) => request(`/admin/outsourcing/${id}`, { method: 'GET' }),
  updateOutsourcingStatus: async (id: number, status: string) => request(`/admin/outsourcing/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  
  // Payments
  getAllPayments: async (page = 1, limit = 50) => request(`/admin/payments?page=${page}&limit=${limit}`, { method: 'GET' }),
  getPaymentStats: async () => request('/admin/payments/stats', { method: 'GET' }),
  
  // Documents
  downloadDocument: async (documentId: number, filename: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/documents/${documentId}/download`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to download document');
      }
      
      // Create blob from response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Document downloaded successfully' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to download document' };
    }
  },
  
  // Export and Real-time
  exportData: async (type: string, options: any) => request('/admin/export', { method: 'POST', body: JSON.stringify({ type, ...options }) }),
  subscribeToRealTimeUpdates: (callback: (payload: any) => void) => {
    // Placeholder for real-time subscriptions
    console.log('Real-time subscriptions not implemented for Laravel backend');
    return [];
  },
  unsubscribeFromRealTimeUpdates: (channels: any[]) => {
    console.log('Unsubscribing from real-time updates');
  },
};

// Test connection function - Enhanced for cPanel Laravel backend
const testSupabaseConnection = async () => {
  try {
    const response = await request('/health');
    return { 
      success: !response.error, 
      data: response.error ? null : response,
      message: response.error || 'Connected to Laravel backend successfully'
    };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message,
      message: 'Failed to connect to Laravel backend'
    };
  }
};

// New function specifically for Laravel backend health check
const testLaravelConnection = async () => {
  try {
    const startTime = Date.now();
    const response = await request('/health');
    const endTime = Date.now();
    
    return {
      success: !response.error,
      data: {
        status: response.error ? 'disconnected' : 'connected',
        latency: endTime - startTime,
        timestamp: new Date().toISOString(),
        backend: 'Laravel/PostgreSQL',
        endpoint: API_BASE_URL,
        ...response
      },
      message: response.error || `Connected to Laravel backend (${endTime - startTime}ms)`
    };
  } catch (error: any) {
    return {
      success: false,
      data: {
        status: 'disconnected',
        timestamp: new Date().toISOString(),
        backend: 'Laravel/PostgreSQL',
        endpoint: API_BASE_URL,
        error: error.message
      },
      message: `Failed to connect to Laravel backend: ${error.message}`
    };
  }
};

export {
  authService,
  claimsService,
  quotesService,
  paymentsService,
  outsourcingService,
  diasporaService,
  consultationsService,
  resourcesService,
  dashboardService,
  adminService,
  testSupabaseConnection,
  testLaravelConnection,
};

// Default API object
const api = {
  authService,
  claimsService,
  quotesService,
  paymentsService,
  outsourcingService,
  diasporaService,
  consultationsService,
  resourcesService,
  dashboardService,
  adminService,
  testSupabaseConnection,
  testLaravelConnection,
};

export default api;

  },



  getClaimById: async (id: number) => {

    try {

      const response = await request(`/admin/claims/${id}`);

      return {

        success: !response.error,

        data: response.error ? null : (response.data || response),

        message: response.error || 'Claim loaded successfully'

      };

    } catch (error: any) {

      return {

        success: false,

        data: null,

        message: error.message || 'Failed to load claim'

      };

    }

  },



  getClaimsStats: async () => {

    try {

      const response = await request('/admin/claims/stats');

      return {

        success: !response.error,

        data: response.error ? { total: 0, pending: 0, approved: 0, rejected: 0 } : response,

        message: response.error || 'Claims stats loaded successfully'

      };

    } catch (error: any) {

      return {

        success: false,

        data: { total: 0, pending: 0, approved: 0, rejected: 0 },

        message: error.message || 'Failed to load claims stats'

      };

    }

  },



  updateClaimStatus: async (id: number, status: string) => {

    try {

      const response = await request(`/admin/claims/${id}/status`, { 

        method: 'PUT', 

        body: JSON.stringify({ status }) 

      });

      return {

        success: !response.error,

        data: response.error ? null : response,

        message: response.error || 'Claim status updated successfully'

      };

    } catch (error: any) {

      return {

        success: false,

        data: null,

        message: error.message || 'Failed to update claim status'

      };

    }

  },

  

  // Consultations

  getAllConsultations: async (page = 1, limit = 50, status?: string, search?: string) => {

    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });

    if (status) params.append('status', status);

    if (search) params.append('search', search);

    return request(`/admin/consultations?${params.toString()}`, { method: 'GET' });

  },

  getConsultationById: async (id: number) => request(`/admin/consultations/${id}`, { method: 'GET' }),

  updateConsultationStatus: async (id: number, status: string) => request(`/admin/consultations/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  

  // Quotes

  getAllQuotes: async (page = 1, limit = 50) => request(`/admin/quotes?page=${page}&limit=${limit}`, { method: 'GET' }),

  getQuoteById: async (id: number) => request(`/admin/quotes/${id}`, { method: 'GET' }),

  updateQuoteStatus: async (id: number, status: string) => request(`/admin/quotes/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  

  // Diaspora

  getAllDiasporaRequests: async (page = 1, limit = 50) => request(`/admin/diaspora?page=${page}&limit=${limit}`, { method: 'GET' }),

  getDiasporaById: async (id: number) => request(`/admin/diaspora/${id}`, { method: 'GET' }),

  updateDiasporaStatus: async (id: number, status: string) => request(`/admin/diaspora/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  

  // Outsourcing

  getAllOutsourcingRequests: async (page = 1, limit = 50) => request(`/admin/outsourcing?page=${page}&limit=${limit}`, { method: 'GET' }),

  getOutsourcingById: async (id: number) => request(`/admin/outsourcing/${id}`, { method: 'GET' }),

  updateOutsourcingStatus: async (id: number, status: string) => request(`/admin/outsourcing/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  

  // Payments

  getAllPayments: async (page = 1, limit = 50) => request(`/admin/payments?page=${page}&limit=${limit}`, { method: 'GET' }),

  getPaymentStats: async () => request('/admin/payments/stats', { method: 'GET' }),

  

  // Documents

  downloadDocument: async (documentId: number, filename: string) => {

    try {

      const response = await fetch(`${API_BASE_URL}/admin/documents/${documentId}/download`, {

        method: 'GET',

        headers: {

          'Content-Type': 'application/json',

        },

      });

      

      if (!response.ok) {

        throw new Error('Failed to download document');

      }

      

      // Create blob from response

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;

      a.download = filename;

      document.body.appendChild(a);

      a.click();

      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);

      

      return { success: true, message: 'Document downloaded successfully' };

    } catch (error: any) {

      return { success: false, message: error.message || 'Failed to download document' };

    }

  },

  

  // Export and Real-time

  exportData: async (type: string, options: any) => request('/admin/export', { method: 'POST', body: JSON.stringify({ type, ...options }) }),

  subscribeToRealTimeUpdates: (callback: (payload: any) => void) => {

    // Placeholder for real-time subscriptions

    console.log('Real-time subscriptions not implemented for Laravel backend');

    return [];

  },

  unsubscribeFromRealTimeUpdates: (channels: any[]) => {

    console.log('Unsubscribing from real-time updates');

  },

};



// Test connection function - Enhanced for cPanel Laravel backend

const testSupabaseConnection = async () => {

  try {

    const response = await request('/health');

    return { 

      success: !response.error, 

      data: response.error ? null : response,

      message: response.error || 'Connected to Laravel backend successfully'

    };

  } catch (error: any) {

    return { 

      success: false, 

      error: error.message,

      message: 'Failed to connect to Laravel backend'

    };

  }

};



// New function specifically for Laravel backend health check

const testLaravelConnection = async () => {

  try {

    const startTime = Date.now();

    const response = await request('/health');

    const endTime = Date.now();

    

    return {

      success: !response.error,

      data: {

        status: response.error ? 'disconnected' : 'connected',

        latency: endTime - startTime,

        timestamp: new Date().toISOString(),

        backend: 'Laravel/PostgreSQL',

        endpoint: API_BASE_URL,

        ...response

      },

      message: response.error || `Connected to Laravel backend (${endTime - startTime}ms)`

    };

  } catch (error: any) {

    return {

      success: false,

      data: {

        status: 'disconnected',

        timestamp: new Date().toISOString(),

        backend: 'Laravel/PostgreSQL',

        endpoint: API_BASE_URL,

        error: error.message

      },

      message: `Failed to connect to Laravel backend: ${error.message}`

    };

  }

};



export {

  authService,

  claimsService,

  quotesService,

  paymentsService,

  outsourcingService,

  diasporaService,

  consultationsService,

  resourcesService,

  dashboardService,

  adminService,

  testSupabaseConnection,

  testLaravelConnection,

};



// Default API object

const api = {

  authService,

  claimsService,

  quotesService,

  paymentsService,

  outsourcingService,

  diasporaService,

  consultationsService,

  resourcesService,

  dashboardService,

  adminService,

  testSupabaseConnection,

  testLaravelConnection,

};



export default api;


