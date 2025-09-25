import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardStats } from './dto/dashboard-stats.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('comprehensive')
  async getComprehensiveDashboard(): Promise<{ success: boolean, data: DashboardStats }> {
    console.log('📋 GET /dashboard/comprehensive endpoint called');
    return this.dashboardService.getComprehensiveDashboard();
  }
}