import { Entity, PrimaryGeneratedColumn,Column } from 'typeorm';

@Entity('basedConcultations')
export class BasedConsultation {
@PrimaryGeneratedColumn()
id:number;
@Column()
email:string;
@Column()
phone:number;
@Column()
project_description:string;
@Column()
estimated_duration:string;
}
