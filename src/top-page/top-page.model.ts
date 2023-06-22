import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type TopPageDocument = HydratedDocument<TopPageModel>;
export enum TopLevelCategory {
	Courses,
	Services,
	Books,
	Products,
}
export class HhData {
	@Prop()
	count: number;
	@Prop()
	juniorSalary: number;
	@Prop()
	middleSalary: number;
	@Prop()
	seniorSalary: number;
}
export class Advantages {
	@Prop()
	description: string;
	@Prop()
	title: string;
}
@Schema({ timestamps: true, _id: true })
export class TopPageModel extends Document {
	@Prop({ enum: TopLevelCategory })
	firstLevelCategory: TopLevelCategory;

	@Prop()
	secondLevelCategory: string;

	@Prop({ unique: true })
	alias: string;

	@Prop({ index: true })
	title: string;

	@Prop()
	category: string;

	@Prop({ type: HhData })
	hh?: HhData;

	@Prop({ type: MongooseSchema.Types.Array })
	advantages: Advantages[];

	@Prop()
	seoText: string;

	@Prop({ type: [String] })
	tags: string[];

	@Prop()
	tagsTitle: string;
}

export const TopPageSchema = SchemaFactory.createForClass(TopPageModel);
