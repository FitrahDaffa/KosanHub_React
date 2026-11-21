import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min, MinLength, MaxLength } from 'class-validator';

export enum PaymentStatusDto { LUNAS = 'LUNAS', MENUNGGU = 'MENUNGGU', TERTUNDA = 'TERTUNDA' }

export class CreatePaymentDto {
  @IsString() @MinLength(1) @MaxLength(30) code!: string;
  @Type(() => Number) @IsInt() @Min(0) amount!: number;
  @IsDateString() paidAt!: string;
  @IsOptional() @IsEnum(PaymentStatusDto) status?: PaymentStatusDto;
  @IsUUID() residentId!: string;
}

export class UpdatePaymentDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(30) code?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) amount?: number;
  @IsOptional() @IsDateString() paidAt?: string;
  @IsOptional() @IsEnum(PaymentStatusDto) status?: PaymentStatusDto;
  @IsOptional() @IsUUID() residentId?: string;
}
