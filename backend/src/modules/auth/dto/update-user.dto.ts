import { IsString, IsOptional, IsDateString, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ example: 'Juan', required: false })
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiProperty({ example: 'Pérez', required: false })
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiProperty({ example: '+573001234567', required: false })
    @IsPhoneNumber('CO')
    @IsOptional()
    phone?: string;

    @ApiProperty({ example: '1990-01-01', required: false })
    @IsDateString()
    @IsOptional()
    dateOfBirth?: string;
}
