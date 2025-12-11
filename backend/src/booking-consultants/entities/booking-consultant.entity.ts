import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum ConsultationType {
   RISK_ASSESMENT='Risk Assesment',
   CORPORATE_STRUCTURING='Corporate Structuring',
   CLAIMS_AUDIT='Claims Audit',
   POLICY_REVIEW='Policy Review',
   INSURANCE_TRAINING='Insurance Training',
   GENERAL_CONSULTATION='General Consultation'
}

@Entity('booking_consultants')
export class BookingConsultant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    full_name: string;

    @Column({ length: 255 })
    email: string;

    @Column({ length: 50 })
    phone: string;

    @Column({ length: 255 })
    organization: string;

    @Column({
        type: 'enum',
        enum: ConsultationType
    })
    consult_type: ConsultationType;

    @Column({ type: 'date' })
    preferred_date: string;

    @Column({ type: 'time' })
    preferred_time: string;

    @Column({ type: 'text', nullable: true })
    details: string;

    @CreateDateColumn()
    created_at: Date;
}
