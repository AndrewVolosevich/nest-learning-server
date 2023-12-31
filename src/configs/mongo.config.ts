import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';

export const getMongoConfig = async (
	configService: ConfigService,
): Promise<MongooseModuleFactoryOptions> => {
	return {
		uri: getMongoString(configService),
		...getMongoOptions(),
	};
};

const getMongoString = (configService: ConfigService) => {
	return `mongodb+srv://${configService.get('MONGO_LOGIN')}:${configService.get(
		'MONGO_PASSWORD',
	)}@top-api.wy6oior.mongodb.net/?retryWrites=true&w=majority`;
	// return `mongodb://${configService.get('MONGO_LOGIN')}:${configService.get(
	// 	'MONGO_PASSWORD',
	// )}@${configService.get('MONGO_HOST')}:${configService.get(
	// 	'MONGO_PORT',
	// )}/${configService.get('MONGO_AUTH_DB')}`;
};
const getMongoOptions = () => {
	return {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
};
