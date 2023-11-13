import { NGon } from './figures/NGon';
import { Circle } from './figures/Circle';
import {
	type DTO,
	type Figure,
	type CircleDTO,
	type NgonDTO,
	FigureType,
	ReadableDto
} from './figures';

export class FiguresFactory {
	public static createFigure(dto: ReadableDto<DTO, string>): Figure {
		console.log(`Creating figure of type ${dto.figureType}
    with params ${JSON.stringify(dto)}`);

		switch (dto.dtoWrapper.figureType) {
			case FigureType.Circle:
				return new Circle(dto as unknown as ReadableDto<CircleDTO, string>);
			case FigureType.Square:
				return new NGon(dto as unknown as ReadableDto<NgonDTO, string>);
			default:
				throw new Error('Invalid figure type');
		}
	}
}
