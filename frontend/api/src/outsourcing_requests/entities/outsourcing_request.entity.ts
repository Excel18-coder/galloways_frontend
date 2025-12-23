import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
export enum OutsourcingService {
  UNDERWRITING_SUPPORT = 'Underwriting Support',
  CLAIMS_AUDIT = 'Claims Audit',
  CLAIMS_DATA_MANAGEMENT = 'Claims Data Management',
  QUOTATION_SUPPORT = 'Quotation Support',
  RENEWAL_NEGOTIATION = 'Renewal Negotiation',
  POLICY_ADMINISTRATION = 'Policy Administration',

}
export enum BudgetRange {
  KES_50_100K = 'KES 50,000 - 100,000',
  KES_100_250K = 'KES 100,000 - 250,000',
  KES_250_500K = 'KES 250,000 - 500,000',
  KES_500K_1M = 'KES 500,000 - 1,000,000',
  KES_1M_PLUS = 'KES 1,000,000+'
}

export enum NatureOfOutsourcing{
  FULL_OUTSOURCING = 'Full outsourcing',
  PARTIAL_OUTSOURCING = 'Partial outsourcing',
  ON_DEMAND_SUPPORT = 'On-demand support'
}
@Entity('outsourcing_requests')
export class OutsourcingRequest {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // user_id: number;

  @Column({ length: 255 })
  organization_name: string;

  @Column({ type: 'text' })
  core_functions: string;

  @Column({ length: 255 })
  location: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ length: 255 })
  email: string;

  @Column({ type: 'jsonb', nullable: true })
  services: unknown;

  @Column({ length: 255 })
  nature_of_outsourcing: string;

  @Column({ length: 255 })
  budget_range: string;

  @Column({ length: 50, default: 'pending' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
