 
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { 
  IsString, IsEmail, IsEnum, IsArray, IsNumber, IsOptional, 
  MinLength, MaxLength, Matches, Min, ArrayMinSize, IsUrl
} from 'class-validator';
import { Transform } from 'class-transformer';
import { DocType, GenderEnum, Roles, VehiclesType } from '../../schema/helper.schema';

export class CreateHelperDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30) 
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsEnum(Roles)
  typeOfService: Roles;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  organization: string;

  @IsString()
  @Matches(/^[+]?[1-9][\d]{0,15}$/, {
    message: 'Phone number must be a valid format'
  })
  @Transform(({ value }) => value?.trim())
  phone: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one language is required' })
  @IsString({ each: true })
  languages: string[];

  @IsNumber()
  @Min(1)
  employeeId: number;

  @IsEnum(VehiclesType)
  type: VehiclesType;

  @IsEnum(DocType)
  @IsOptional()
  status?: DocType = DocType.ADHAAR;

  @IsOptional()
  @IsUrl({}, { message: 'KYC URL must be a valid URL' })
  kycUrl?: string;
}