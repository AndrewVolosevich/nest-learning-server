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
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { FindProductDto } from './dto/find-product.dto';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { NOT_FOUND, SMTH_GOES_WRONG } from '../http.constants';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('product')
export class ProductController {
	constructor(
		@Inject(ProductService) private readonly productService: ProductService,
	) {}
	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateProductDto) {
		const product = await this.productService.create(dto);
		if (!product) {
			throw new HttpException(
				SMTH_GOES_WRONG,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
		return product;
	}
	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		const product = await this.productService.getById(id);
		if (!product) {
			throw new HttpException(NOT_FOUND, HttpStatus.BAD_REQUEST);
		}
		return product;
	}
	@UseGuards(JwtGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const product = await this.productService.deleteById(id);
		if (!product) {
			throw new HttpException(NOT_FOUND, HttpStatus.BAD_REQUEST);
		}
		return product;
	}
	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Patch(':id')
	async patch(
		@Body() dto: CreateProductDto,
		@Param('id', IdValidationPipe) id: string,
	) {
		const product = await this.productService.updateProduct(id, dto);
		if (!product) {
			throw new HttpException(NOT_FOUND, HttpStatus.BAD_REQUEST);
		}
		return product;
	}
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindProductDto) {
		const products = await this.productService.findByCategory(dto);
		if (!products) {
			throw new HttpException(NOT_FOUND, HttpStatus.BAD_REQUEST);
		}
		return products;
	}
}
