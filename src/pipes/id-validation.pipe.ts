import {
	ArgumentMetadata,
	HttpException,
	HttpStatus,
	PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { WRONG_FORMAT } from '../http.constants';

export class IdValidationPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata): any {
		if (metadata.type !== 'param') {
			return value;
		}
		if (!Types.ObjectId.isValid(value)) {
			throw new HttpException(WRONG_FORMAT, HttpStatus.BAD_REQUEST);
		}
		return value;
	}
}
