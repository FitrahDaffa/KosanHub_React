import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, MinLength, MaxLength } from 'class-validator';

export class CreateRoomDto {
  @IsString() @MinLength(1) @MaxLength(20) number!: string;
  @IsString() @MinLength(1) @MaxLength(50) type!: string;
  @Type(() => Number) @IsInt() @Min(0) price!: number;
}

export class UpdateRoomDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(20) number?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(50) type?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) price?: number;
}
