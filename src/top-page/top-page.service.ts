import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TopLevelCategory, TopPageModel } from './top-page.model';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { Model } from 'mongoose';

@Injectable()
export class TopPageService {
	constructor(
		@InjectModel(TopPageModel.name)
		private readonly topPageModel: Model<TopPageModel>,
	) {}

	async create(dto: CreateTopPageDto) {
		return this.topPageModel.create(dto);
	}

	async getById(id: string) {
		return this.topPageModel.findById(id);
	}

	async findText(text: string) {
		return this.topPageModel
			.find({
				$text: {
					$search: text,
					$caseSensitive: false,
				},
			})
			.exec();
	}

	async findByFirstCategory(firstLevelCategory: TopLevelCategory) {
		return this.topPageModel
			.aggregate()
			.match({
				firstLevelCategory,
			})
			.group({
				_id: '$secondLevelCategory',
				pages: {
					$push: {
						alias: '$alias',
						title: '$title',
					},
				},
			})
			.exec();
	}

	async findByAlias(alias: string) {
		return this.topPageModel.findOne({ alias });
	}

	async delete(id: string) {
		return this.topPageModel.findByIdAndDelete(id);
	}

	async updateTopPage(dto: CreateTopPageDto, id: string) {
		return this.topPageModel.findByIdAndUpdate(id, dto, { new: true });
	}
}
