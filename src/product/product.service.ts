import { Injectable } from '@nestjs/common';
import { ProductModel } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ReviewModel } from '../review/review.model';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(ProductModel.name)
		private readonly productModel: Model<ProductModel>,
	) {}
	async create(dto: CreateProductDto) {
		return this.productModel.create(dto);
	}
	async getById(id: string) {
		return this.productModel.findById(id).exec();
	}
	async deleteById(id: string) {
		return this.productModel.findById(id).exec();
	}
	async findByCategory(dto: FindProductDto) {
		return (await this.productModel
			.aggregate([
				{ $match: { categories: dto.category } },
				{ $sort: { _id: 1 } },
				{ $limit: dto.limit },
				{
					$lookup: {
						from: 'reviewmodels',
						localField: '_id',
						foreignField: 'productId',
						as: 'reviews',
					},
				},
				{
					$addFields: {
						reviewCount: { $size: '$reviews' },
						reviewAvg: { $avg: '$reviews.rating' },
						reviews: {
							$function: {
								body: `function(reviews) {
							 reviews.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
							 return reviews
								}`,
								args: ['$reviews'],
								lang: 'js',
							},
						},
					},
				},
			])
			.exec()) as unknown as (ProductModel & {
			reviews: ReviewModel[];
			reviewCount: number;
			reviewAvg: number;
		})[];
	}

	async updateProduct(id: string, dto: CreateProductDto) {
		return this.productModel.findByIdAndUpdate(id, dto, { new: true });
	}
}
