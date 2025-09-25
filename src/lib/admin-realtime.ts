import { supabase } from './supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

class AdminRealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();
  private listeners: Map<string, ((data: unknown) => void)[]> = new Map();
  private isConnected = false;

  connect() {
    if (this.isConnected) {
      return true;
    }

    console.log('🔌 Connecting to Supabase real-time service...');
    
    // Set up real-time channels for different data types
    this.setupDashboardChannel();
    this.setupClaimsChannel();
    this.setupConsultationsChannel();
    this.setupPaymentsChannel();
    this.setupUsersChannel();

    this.isConnected = true;
    console.log('✅ Connected to Supabase real-time service');
    
    return true;
  }

  disconnect() {
    console.log('❌ Disconnecting from Supabase real-time service...');
    
    // Unsubscribe from all channels
    for (const [, channel] of this.channels) {
      supabase.removeChannel(channel);
    }
    
    this.channels.clear();
    this.listeners.clear();
    this.isConnected = false;
  }

  private setupDashboardChannel() {
    // Listen to activities table for dashboard updates
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'activities' },
        (payload) => {
          console.log('Dashboard activity change:', payload);
          this.notifyListeners('dashboard-update', payload);
          this.notifyListeners('recent-activity', payload);
        }
      )
      .subscribe();

    this.channels.set('dashboard', channel);
  }

  private setupClaimsChannel() {
    const channel = supabase
      .channel('claims-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'claims' },
        (payload) => {
          console.log('Claims change:', payload);
          this.notifyListeners('claims-data', payload);
          this.notifyListeners('claim-update', payload);
          this.notifyListeners('data-change', { type: 'claims', ...payload });
        }
      )
      .subscribe();

    this.channels.set('claims', channel);
  }

  private setupConsultationsChannel() {
    const channel = supabase
      .channel('consultations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'consultations' },
        (payload) => {
          console.log('Consultations change:', payload);
          this.notifyListeners('consultations-data', payload);
          this.notifyListeners('consultation-update', payload);
          this.notifyListeners('data-change', { type: 'consultations', ...payload });
        }
      )
      .subscribe();

    this.channels.set('consultations', channel);
  }

  private setupPaymentsChannel() {
    const channel = supabase
      .channel('payments-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payments' },
        (payload) => {
          console.log('Payments change:', payload);
          this.notifyListeners('payments-data', payload);
          this.notifyListeners('payment-update', payload);
          this.notifyListeners('data-change', { type: 'payments', ...payload });
        }
      )
      .subscribe();

    this.channels.set('payments', channel);
  }

  private setupUsersChannel() {
    const channel = supabase
      .channel('users-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        (payload) => {
          console.log('Users change:', payload);
          this.notifyListeners('users-data', payload);
          this.notifyListeners('data-change', { type: 'users', ...payload });
        }
      )
      .subscribe();

    this.channels.set('users', channel);
  }

  subscribe(event: string, callback: (data: unknown) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  unsubscribe(event: string, callback: (data: unknown) => void) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private notifyListeners(event: string, data: unknown) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  // Request specific data (these now just trigger data fetches since Supabase is always up-to-date)
  requestDashboardData() {
    console.log('📊 Dashboard data requested (real-time updates active)');
    this.notifyListeners('dashboard-data', { message: 'Real-time dashboard monitoring active' });
  }

  requestClaimsData() {
    console.log('📋 Claims data requested (real-time updates active)');
    this.notifyListeners('claims-data', { message: 'Real-time claims monitoring active' });
  }

  requestConsultationsData() {
    console.log('💬 Consultations data requested (real-time updates active)');
    this.notifyListeners('consultations-data', { message: 'Real-time consultations monitoring active' });
  }

  requestUsersData() {
    console.log('👥 Users data requested (real-time updates active)');
    this.notifyListeners('users-data', { message: 'Real-time users monitoring active' });
  }

  requestPaymentsData() {
    console.log('💳 Payments data requested (real-time updates active)');
    this.notifyListeners('payments-data', { message: 'Real-time payments monitoring active' });
  }
}

export const adminRealtimeService = new AdminRealtimeService();
