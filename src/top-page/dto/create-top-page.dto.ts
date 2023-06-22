import { TopLevelCategory } from '../top-page.model';
import {
	IsArray,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class HhData {
	@IsNumber()
	count: number;
	@IsNumber()
	juniorSalary: number;
	@IsNumber()
	middleSalary: number;
	@IsNumber()
	seniorSalary: number;
}

class Advantages {
	@IsString()
	description: string;
	@IsString()
	title: string;
}

export class CreateTopPageDto {
	@IsEnum(TopLevelCategory)
	firstLevelCategory: TopLevelCategory;

	@IsString()
	secondLevelCategory: string;

	@IsString()
	alias: string;

	@IsString()
	title: string;

	@IsString()
	category: string;

	@Type(() => HhData)
	@IsOptional()
	@ValidateNested()
	hh: HhData;

	@Type(() => Advantages)
	@IsArray()
	@ValidateNested()
	advantages: Advantages[];

	@IsString()
	seoText: string;

	@IsArray()
	@IsString({ each: true })
	tags: string[];

	@IsString()
	tagsTitle: string;
}
