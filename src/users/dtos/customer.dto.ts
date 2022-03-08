import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsArray, // 👈 new decorator
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  readonly phone: string;

  @IsArray()
  @IsNotEmpty()
  readonly skills: any; // 👈 new field
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
