import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
export enum paymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id: number;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column({ length: 10, default: 'KES' })
  currency: string;

  @Column({ length: 255, nullable: true })
  method: string;

  @Column({ length: 255, nullable: true })
  paymentMethod: string;

  @Column({ length: 255, nullable: true })
  paymentProvider: string;

  @Column({ length: 255, nullable: true })
  transactionId: string;

  @Column({ length: 50, default: 'pending' })
  status: string;

  @Column({ length: 255 })
  reference: string;

  @Column({ length: 255, nullable: true })
  customerEmail: string;

  @Column({ length: 255, nullable: true })
  customerPhone: string;

  @Column({ length: 255, nullable: true })
  customerName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  consultationId: number;

  @Column({ nullable: true })
  diasporaRequestId: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  setAutoReference() {
    if (!this.reference || this.reference.trim().length === 0) {
      const random = Math.random().toString(36).slice(2, 8).toUpperCase();
      this.reference = `PAY-${Date.now()}-${random}`;
    }
  }
}
