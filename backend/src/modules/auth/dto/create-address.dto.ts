import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AddressType } from '../entities/user-address.entity';

export class CreateAddressDto {
  @ApiProperty({ enum: AddressType })
  @IsEnum(AddressType)
  @IsNotEmpty()
  type: AddressType;

  @ApiProperty({ example: 'Calle 123 #45-67' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: 'Bogotá' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Cundinamarca' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: '110111' })
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty({ example: 'Colombia', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
