import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('quotes')
export class Quote {
  @PrimaryGeneratedColumn()
  id: number;

  // Personal Information
  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 50 })
  phone: string;

  @Column({ length: 255 })
  location: string;

  // Product Information
  @Column({ length: 255 })
  product: string;

  @Column({ length: 255 })
  selectedProduct: string;

  @Column({ length: 100, nullable: true })
  constructionType?: string;

  @Column({ length: 100, nullable: true })
  occupancy?: string;

  // Quote Details
  @Column({ length: 100 })
  budget: string;

  @Column({ length: 100 })
  coverage: string;

  @Column({ type: 'text', nullable: true })
  details?: string;

  // Contact Preferences
  @Column({ length: 100 })
  contactMethod: string;

  @Column({ length: 100 })
  bestTime: string;

  @Column({ type: 'text', nullable: true, default: null })
  documents: string;

  @Column({ type: 'boolean', default: false })
  terms: boolean;

  // Status and Timestamps
  @Column({ length: 30, default: 'Pending' })
  status?: string;

  @Column({ type: 'timestamp', nullable: true })
  timestamp?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
