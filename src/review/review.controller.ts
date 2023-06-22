import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Inject,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ReviewCreateDto } from './dto/review-create.dto';
import { ReviewService } from './review.service';
import { REVIEW_NOT_FOUND } from '../http.constants';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

@Controller('review')
export class ReviewController {
	constructor(
		@Inject(ReviewService) private readonly reviewService: ReviewService,
	) {}
	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: ReviewCreateDto) {
		return this.reviewService.create(dto);
	}
	@UseGuards(JwtGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedReview = await this.reviewService.delete(id);
		if (!deletedReview) {
			throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}
	@Get('byProduct/:id')
	async getByProduct(@Param('id', IdValidationPipe) id: string) {
		return this.reviewService.findByProductId(id);
	}
}
