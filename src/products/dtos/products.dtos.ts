import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
  IsOptional,
  Min, 
  ValidateIf,
  ValidateNested, // 👈 new decorator
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

import { CreateCategoryDto } from './category.dtos';  // 👈

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `product's name` }) // 👈 use ApiProperty
  readonly name: string; 

  @IsString()
  @IsNotEmpty()
  @ApiProperty() // 👈 use ApiProperty
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty() // 👈 use ApiProperty
  readonly price: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty() // 👈 use ApiProperty
  readonly stock: number;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty() // 👈 use ApiProperty
  readonly image: string;

  @IsNotEmpty()
  @ValidateNested()
  @ApiProperty()
  readonly category: CreateCategoryDto; // 👈 new field
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class FilterProductsDto { // 👈 new DTO
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @Min(0)
  offset: number;

  @IsOptional()
  @Min(0)
  minPrice: number; // 👈 new field

  @ValidateIf((params) => params.minPrice)
  @IsPositive()
  maxPrice: number;  // 👈 new field
}