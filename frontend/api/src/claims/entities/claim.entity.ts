import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
export enum claimStatus {
  PENDING = 'pending  ',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_REVIEW = 'in-review',
  CLOSED = 'closed',
  PROCCESSING = 'processing'
}
export enum ClaimType {
  MOTOR = 'Motor',
  HEALTH = 'Health',
  PROPERTY = 'Property',
  TRAVEL = 'Travel',
  LIFE = 'Life',
  PUBLIC_LIABILITY = 'Public liability',
  FIDELITY_GUARANTEE = 'Fidelity guarantee',
  WORKSMEN_COMPENSATION_ACCIDENT = 'Worksmen compensation accident',
  WINDSCREEN_AND_WINDOW_DAMAGE = 'Windscreen and window damage',
  MOTOR_ENTERTAINMENT = 'Motor entertainment',
  MOTOR_THEFT = 'Motor theft',
}

export interface Document {
  id: number;
  original_name: string;
  size: number;
  created_at: string;
  path?: string;
  mime_type?: string;
}

@Entity('claims')
export class Claim {
  @PrimaryGeneratedColumn()
  Id: number;

  // @Column()
  // user_id: number;

  @Column()
  policy_number: number;

  @Column({ type: 'enum', enum: ClaimType })
  claim_type: ClaimType;

  @Column()
  incident_date: Date;

  @Column()
  estimated_loss: number;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: claimStatus, default: claimStatus.PENDING })
  status: claimStatus;

  @Column()
  email: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'text', nullable: true, default: null })
  supporting_documents: string;
}
