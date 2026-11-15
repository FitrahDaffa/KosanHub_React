import { PartialType } from '@nestjs/mapped-types';
import { CreatePenghuniDto } from './create-penghuni.dto';

export class UpdatePenghuniDto extends PartialType(CreatePenghuniDto) {}
