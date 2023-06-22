import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import mongoose from 'mongoose';

describe('Auth controller (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/login (POST) - success', async () => {
		const response = await request(app.getHttpServer())
			.post('/auth/login')
			.send({ email: 'test@gmail.com', password: '12345' });

		expect(response.status).toEqual(200);
		expect(response.body.token).toBeDefined();
	});

	it('/auth/login (POST) - password error', async () => {
		const response = await request(app.getHttpServer())
			.post('/auth/login')
			.send({ email: 'test@gmail.com', password: '1234' });

		expect(response.status).toEqual(400);
		expect(response.body.token).toBeUndefined();
	});

	it('/auth/login (POST) - email error', async () => {
		const response = await request(app.getHttpServer())
			.post('/auth/login')
			.send({ email: 'test@gmail.com1', password: '12345' });

		expect(response.status).toEqual(400);
		expect(response.body.token).toBeUndefined();
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await app.close();
	});
});
