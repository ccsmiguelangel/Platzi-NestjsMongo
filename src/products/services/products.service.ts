import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';

import { Product } from './../entities/product.entity';
import { CreateProductDto, UpdateProductDto, FilterProductsDto } from './../dtos/products.dtos';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  // findAll(params?: FilterProductsDto) { 
  //   if (params) {
  //     const { limit, offset } = params;
  //     return this.productModel.find().skip(offset).limit(limit).exec();  // 👈
  //   }
  //   return this.productModel.find().exec();
  // }
  findAll(params?: FilterProductsDto) {
    if (params) {
      const filters: FilterQuery<Product> = {}; // 👈 create filters
      const { limit, offset } = params;
      const { minPrice, maxPrice } = params; // 👈
      if (minPrice && maxPrice) {
        filters.price = { $gte: minPrice, $lte: maxPrice };
      }
      return this.productModel.find(filters).skip(offset).limit(limit).exec();
    }
    return this.productModel.find().exec();
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  create(data: CreateProductDto) {  // 👈
    const newProduct = new this.productModel(data);
    return newProduct.save();
  }

  update(id: string, changes: UpdateProductDto) {  // 👈
    const product = this.productModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  remove(id: string) {  // 👈
    return this.productModel.findByIdAndDelete(id);
  }
}