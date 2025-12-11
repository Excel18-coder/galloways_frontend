import {
  Entity,
  Column,
  PrimaryGeneratedColumn,

  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  // DRIVER = 'driver',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  email: string;
  @Column({ type: 'varchar', length: 500 })
  name: string;



  @Column({ length: 255 })
  password: string;

  @Column({ unique: true, length: 20 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  hashedRefreshToken?: string | null;

  // @DeleteDateColumn({ type: 'timestamp',})
  // deletedAt?: Date;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;



  // Hooks
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      const saltRounds = 12;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  trimStrings() {
    if (this.name) {
      this.name = this.name.trim();
    }


  }

  // Methods
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // toJSON() {
  //   const { password, hashedRefreshToken, ...result } = this;
  //   return result;
  // }


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
