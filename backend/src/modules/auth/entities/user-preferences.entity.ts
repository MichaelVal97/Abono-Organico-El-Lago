import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum Theme {
    LIGHT = 'light',
    DARK = 'dark',
    SYSTEM = 'system',
}

export enum Language {
    ES = 'es',
    EN = 'en',
}

@Entity('user_preferences')
export class UserPreferences {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: Theme,
        default: Theme.SYSTEM,
    })
    theme: Theme;

    @Column({
        type: 'enum',
        enum: Language,
        default: Language.ES,
    })
    language: Language;

    @Column({ default: true, name: 'email_notifications' })
    emailNotifications: boolean;

    @Column({ default: true, name: 'push_notifications' })
    pushNotifications: boolean;

    @Column({ default: false })
    newsletter: boolean;

    @OneToOne(() => User, (user) => user.preferences)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
