import {
	Body,
	Controller,
	HttpCode,
	HttpException,
	HttpStatus,
	Inject,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { REGISTER_ERROR } from '../http.constants';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(@Inject(AuthService) private readonly authService: AuthService) {}
	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: AuthDto) {
		const existedUser = await this.authService.findUser(dto.email);
		if (existedUser) {
			throw new HttpException(REGISTER_ERROR, HttpStatus.BAD_REQUEST);
		}
		return this.authService.createUser(dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto) {
		await this.authService.validateUser(dto);
		return this.authService.login(dto.email);
	}
}
