import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Inject,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { NOT_FOUND } from '../http.constants';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
	constructor(
		@Inject(TopPageService) private readonly topPageService: TopPageService,
	) {}
	@UseGuards(JwtGuard)
	@Post('create')
	async create(@Body() dto: CreateTopPageDto) {
		return this.topPageService.create(dto);
	}
	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		const topPage = await this.topPageService.getById(id);
		if (!topPage) {
			throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return topPage;
	}
	@UseGuards(JwtGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedPage = await this.topPageService.delete(id);
		if (!deletedPage) {
			throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return deletedPage;
	}
	@UseGuards(JwtGuard)
	@Patch(':id')
	async patch(
		@Body() dto: CreateTopPageDto,
		@Param('id', IdValidationPipe) id: string,
	) {
		const updatedPage = await this.topPageService.updateTopPage(dto, id);
		if (!updatedPage) {
			throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return updatedPage;
	}
	@Post('find')
	@HttpCode(200)
	async findByCategory(@Body() dto: FindTopPageDto) {
		return this.topPageService.findByFirstCategory(dto.firstLevelCategory);
	}
	@Get('text-search/:text')
	@HttpCode(200)
	async textSearch(@Param('text') text: string) {
		return this.topPageService.findText(text);
	}

	@Get('byAlias/:alias')
	async findByAlias(@Param('alias') alias: string) {
		const topPage = await this.topPageService.findByAlias(alias);
		if (!topPage) {
			throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return topPage;
	}
}
