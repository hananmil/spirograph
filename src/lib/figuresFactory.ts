import { NGon } from './figures/NGon';
import { Circle } from './figures/Circle';
import { type DTO, type Figure, type CircleDTO, type NgonDTO, FigureType } from './figures';


export class FiguresFactory {
    public static createFigure(dto: DTO): Figure {
        console.log(`Creating figure of type ${dto.figureType}
    with params ${JSON.stringify(dto)}`);
        switch (dto.figureType) {
            case FigureType.Circle:
                return new Circle(dto as CircleDTO);
            case FigureType.Square:
                return new NGon(dto as NgonDTO);
            default:
                throw new Error("Invalid figure type");
        }
    }
}
