import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserModel } from './user.model';
import { InjectModel } from '@nestjs/mongoose';
import { AuthDto } from './dto/auth.dto';
import { Model } from 'mongoose';
import { compare, genSalt, hash } from 'bcryptjs';
import { LOGIN_ERROR, REGISTER_ERROR } from '../http.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel.name)
		private readonly userModel: Model<UserModel>,
		@Inject(JwtService) private readonly jwtService: JwtService,
	) {}

	async findUser(email: string) {
		return this.userModel.findOne({ email }).exec();
	}

	async createUser(dto: AuthDto) {
		const salt = await genSalt(10);
		const passwordHash = await hash(dto.password, salt);
		return this.userModel.create({ email: dto.email, passwordHash });
	}

	async validateUser(dto: AuthDto) {
		const existedUser = await this.findUser(dto.email);
		if (!existedUser) {
			throw new HttpException(LOGIN_ERROR, HttpStatus.BAD_REQUEST);
		} else {
			const isCorrectPass = await compare(
				dto.password,
				existedUser.passwordHash,
			);
			if (!isCorrectPass) {
				throw new HttpException(REGISTER_ERROR, HttpStatus.BAD_REQUEST);
			}
			return { email: dto.email };
		}
	}

	async login(email: string) {
		return { token: await this.jwtService.signAsync({ email }) };
	}
}
