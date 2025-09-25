import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('diaspora_requests')
export class DiasporaRequest {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // user_id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 100 })
  phone: string;

  @Column({ length: 255 })
  country: string;

  @Column({ type: 'text' })
  details: string;

  @Column({ length: 100 })
  consult_time: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 50, default: 'pending' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
