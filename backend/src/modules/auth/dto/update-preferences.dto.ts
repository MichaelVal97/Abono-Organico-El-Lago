import { IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Theme, Language } from '../entities/user-preferences.entity';

export class UpdatePreferencesDto {
    @ApiProperty({ enum: Theme, required: false })
    @IsEnum(Theme)
    @IsOptional()
    theme?: Theme;

    @ApiProperty({ enum: Language, required: false })
    @IsEnum(Language)
    @IsOptional()
    language?: Language;

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    emailNotifications?: boolean;

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    pushNotifications?: boolean;

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    newsletter?: boolean;
}
