import { Injectable } from '@nestjs/common';
import { ReviewModel } from './review.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReviewCreateDto } from './dto/review-create.dto';

@Injectable()
export class ReviewService {
	constructor(
		@InjectModel(ReviewModel.name)
		private readonly reviewModel: Model<ReviewModel>,
	) {}

	async create(dto: ReviewCreateDto) {
		return this.reviewModel.create(dto);
	}
	async delete(id: string) {
		return this.reviewModel.findByIdAndDelete(id).exec();
	}
	async deleteByProductId(id: string) {
		const productId = new Types.ObjectId(id).toHexString();
		return this.reviewModel.deleteMany({ productId });
	}
	async findByProductId(id: string) {
		const productId = new Types.ObjectId(id).toHexString();

		return this.reviewModel.find({ productId }).exec();
	}
}
