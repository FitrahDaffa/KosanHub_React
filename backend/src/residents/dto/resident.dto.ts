import { IsOptional, IsString, IsUUID, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class CreateResidentDto {
  @IsString() @MinLength(1) @MaxLength(120) name!: string;
  @IsString() @MinLength(5) @MaxLength(30) phone!: string;
  @IsOptional() @ValidateIf((_object, value) => value !== null) @IsUUID() roomId?: string | null;
}

export class UpdateResidentDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(120) name?: string;
  @IsOptional() @IsString() @MinLength(5) @MaxLength(30) phone?: string;
  @IsOptional() @ValidateIf((_object, value) => value !== null) @IsUUID() roomId?: string | null;
}
