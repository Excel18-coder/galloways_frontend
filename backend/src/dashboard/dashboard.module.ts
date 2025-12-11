import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Claim } from '../claims/entities/claim.entity';
import { Consultation } from '../consultations/entities/consultation.entity';
import { OutsourcingRequest } from '../outsourcing_requests/entities/outsourcing_request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Claim, Consultation, OutsourcingRequest])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
