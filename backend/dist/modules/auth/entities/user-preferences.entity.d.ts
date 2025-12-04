import { User } from './user.entity';
export declare enum Theme {
    LIGHT = "light",
    DARK = "dark",
    SYSTEM = "system"
}
export declare enum Language {
    ES = "es",
    EN = "en"
}
export declare class UserPreferences {
    id: string;
    theme: Theme;
    language: Language;
    emailNotifications: boolean;
    pushNotifications: boolean;
    newsletter: boolean;
    user: User;
}
