import { Theme, Language } from '../entities/user-preferences.entity';
export declare class UpdatePreferencesDto {
    theme?: Theme;
    language?: Language;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    newsletter?: boolean;
}
