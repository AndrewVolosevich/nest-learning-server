import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { ProductModel } from '../product/product.model';

export type ReviewDocument = HydratedDocument<ReviewModel>;

@Schema({ timestamps: true, _id: true })
export class ReviewModel {
	@Prop()
	name: string;

	@Prop()
	title: string;

	@Prop()
	description: string;

	@Prop()
	rating: number;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: ProductModel.name })
	productId: Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(ReviewModel);
