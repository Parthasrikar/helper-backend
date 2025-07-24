/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { 
  IsString, 
  IsEmail, 
  IsEnum, 
  IsArray, 
  IsNumber, 
  IsOptional, 
  IsDateString, 
  MinLength, 
  MaxLength, 
  Matches, 
  Min, 
  ArrayMinSize,
  IsUrl
} from 'class-validator';
import { Transform } from 'class-transformer';
import { DocType, GenderEnum, Roles, VehiclesType } from '../../schema/helper.schema';


export class UpdateHelperDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsOptional()
  @IsEnum(Roles)
  typeOfService?: Roles;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  organization?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[+]?[1-9][\d]{0,15}$/, {
    message: 'Phone number must be a valid format'
  })
  @Transform(({ value }) => value?.trim())
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string;

  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one language is required' })
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  employeeId?: number;

  @IsOptional()
  @IsDateString()
  joinedDate?: Date;

  @IsOptional()
  @IsEnum(VehiclesType)
  type?: VehiclesType;

  @IsOptional()
  @IsEnum(DocType)
  status?: DocType;

  @IsOptional()
  @IsUrl({}, { message: 'KYC URL must be a valid URL' })
  kycUrl?: string;
}