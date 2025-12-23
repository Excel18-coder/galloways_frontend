import { Module } from '@nestjs/common';
import { BasedConsultationService } from './based-consultation.service';
import { BasedConsultationController } from './based-consultation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasedConsultation } from './entities/based-consultation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BasedConsultation])],
  controllers: [BasedConsultationController],
  providers: [BasedConsultationService],
})
export class BasedConsultationModule {}
