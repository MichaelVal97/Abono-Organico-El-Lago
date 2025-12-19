import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserPreferences } from './user-preferences.entity';
import { UserAddress } from './user-address.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    @Exclude()
    password?: string;

    @Column({ nullable: true, unique: true, name: 'google_id' })
    googleId?: string;

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column({ default: 'user' })
    role: 'user' | 'admin';

    @Column({ nullable: true })
    phone?: string;

    @Column({ type: 'date', nullable: true, name: 'date_of_birth' })
    dateOfBirth?: Date;

    @Column({ nullable: true })
    avatar?: string;

    @Column({ default: true, name: 'is_active' })
    isActive: boolean;

    @Column({ default: false, name: 'is_email_verified' })
    isEmailVerified: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToOne(() => UserPreferences, (preferences) => preferences.user, {
        cascade: true,
        eager: true,
    })
    preferences: UserPreferences;

    @OneToMany(() => UserAddress, (address) => address.user, {
        cascade: true,
    })
    addresses: UserAddress[];

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}
