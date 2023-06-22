import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import mongoose from 'mongoose';
import { ReviewCreateDto } from '../src/review/dto/review-create.dto';

const createTestDto: ReviewCreateDto = {
	name: 'name1',
	title: 'title1',
	description: 'description1',
	rating: 3,
	productId: '6490b733d08de94dedd5b6c3',
};

describe('Review controller (e2e)', () => {
	let app: INestApplication;
	let createdId: string;
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const { body } = await request(app.getHttpServer())
			.post('/auth/login')
			.send({ email: 'test@gmail.com', password: '12345' });

		token = body.token;
	});

	it('/review/create (POST) - success', async () => {
		const response = await request(app.getHttpServer())
			.post('/review/create')
			.send(createTestDto);
		expect(response.status).toEqual(201);
		expect(response.body._id).toBeDefined();
		createdId = response.body._id;
	});

	it('byProduct/:id (GET) - success', async () => {
		const response = await request(app.getHttpServer()).get(
			'/review/byProduct/' + createTestDto.productId,
		);
		expect(response.status).toEqual(200);
		expect(response.body.length).toBeGreaterThanOrEqual(1);
	});

	it('/review/:id (DELETE) - success', async () => {
		const response = await request(app.getHttpServer())
			.delete('/review/' + createdId)
			.set('Authorization', `Bearer ${token}`);
		expect(response.status).toEqual(200);
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await app.close();
	});
});
