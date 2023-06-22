import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { getModelToken } from '@nestjs/mongoose';
import { ReviewModel } from './review.model';
import { Types } from 'mongoose';

describe('ReviewService', () => {
	let service: ReviewService;

	const exec = { exec: jest.fn() };
	const mockedReviewFactory = () => ({ find: () => exec });

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReviewService,
				{
					useFactory: mockedReviewFactory,
					provide: getModelToken(ReviewModel.name),
				},
			],
		}).compile();

		service = module.get<ReviewService>(ReviewService);
	});

	it('defined', () => {
		expect(service).toBeDefined();
	});

	it('find by product id', async () => {
		const productId = new Types.ObjectId().toHexString();
		mockedReviewFactory().find().exec.mockReturnValueOnce([{ productId }]);
		const res = await service.findByProductId(productId);

		expect(res[0].productId).toBe(productId);
	});
});
