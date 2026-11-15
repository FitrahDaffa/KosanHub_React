import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { StatusPenghuni } from '../entities/penghuni.entity';

export class CreatePenghuniDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @IsString()
  @Matches(/^[A-Z]\d{2}$/)
  room!: string;

  @IsString()
  @Matches(/^[0-9+\-\s]{8,20}$/)
  phone!: string;

  @IsDateString()
  moveInDate!: string;

  @IsOptional()
  @IsIn(['Active', 'Leaving'])
  status?: StatusPenghuni;
}
