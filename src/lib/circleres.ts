export class Point extends Object{
    public x:number;
    public y:number;
    constructor(x:number,y:number){
        super();
        this.x = x;
        this.y = y;
    }

    override toString():string{
        return `(${this.x},${this.y})`;
    }   

    public add(other:Point):Point{
        return new Point(this.x+other.x,this.y+other.y);
    }

    public multiplyScalar(factor:number):Point{
        return new Point(this.x*factor,this.y*factor);
    }


    public multiply(other:Point):Point{
        return new Point(this.x*other.x,this.y*other.y);
    }

    public lenght():number{
        return Math.sqrt(this.x*this.x+this.y*this.y);
    }

    public angle():number{
        return Math.atan2(this.y,this.x);
    }

    public static fromPolar(angle:number,radius:number):Point{
        return new Point(radius*Math.cos(angle),radius*Math.sin(angle));
    }
    
}


export enum FigureType{
    Circle,
    Square,
    Lline,
    Triangle,
}

export interface Figure {
    figureType():FigureType;
    getPoint(deltaT:number): Point;
    drawAt(canvas:CanvasRenderingContext2D,point:Point,deltaT:number):void;
}

export interface dto{
    figureType:FigureType;
}

export interface CircleDTO extends dto{
    radius:number;
    pointSpeed:number;
}

export class Circle implements Figure{
    private radius:number;
    private speed:number;
    constructor(dto:CircleDTO){
        this.radius = dto.radius;
        this.speed = dto.pointSpeed;
    }
    
    public figureType():FigureType 
    { 
        return FigureType.Circle;
    }

    public getPoint(deltaT: number): Point {
        const result = new Point(
            this.radius * Math.cos(deltaT*this.speed),
            this.radius * Math.sin(deltaT*this.speed)
        );
        return result;
    }

    public drawAt(canvas:CanvasRenderingContext2D,point:Point,deltaT:number):void{
        canvas.beginPath();
        canvas.arc(point.x,point.y,this.radius,0,2*Math.PI);
        canvas.stroke();
    }
}

export interface NgonDTO extends dto{
    radius:number;
    numSides:number;
    pointSpeed:number;
    rotationSpeed:number;
}

export class NGon implements Figure {
    private radius:number;
    private numSides:number;
    private speed:number;
    private rotationSpeed:number;
    private edgeLength:number;

    constructor(dto:NgonDTO){
        this.radius = dto.radius;
        this.numSides = dto.numSides;
        this.speed = dto.pointSpeed;
        this.rotationSpeed = dto.rotationSpeed;
        this.edgeLength = 2 * this.radius * Math.sin(Math.PI / this.numSides);
    }

    public figureType():FigureType 
    { 
        return FigureType.Square;
    }

    public getPoint(deltaT: number): Point {
        // Calculate the perimeter of the square
        const perimeter = this.numSides * this.edgeLength;
    
        const speed = this.speed *  perimeter/(2*Math.PI);

        // Calculate the distance traveled
        const distanceTraveled = (speed * deltaT) % perimeter ;
    
        // Determine the side of the square the point is on
        const sideIndex = Math.floor(distanceTraveled / this.edgeLength);
    
        // Determine the position on that side
        const positionOnSide = distanceTraveled % this.edgeLength;
    
        // Initialize point coordinates
        let x = 0, y = 0;
    
        const corners = this.cornersPosition(deltaT);
        const p1 = corners[sideIndex];
        const p2 = corners[(sideIndex + 1) % this.numSides];

        // Determine the point coordinates
        const point = p2.add(p1.multiplyScalar(-1)).multiplyScalar(positionOnSide / this.edgeLength).add(p1);

        // Return the new point
        return point;
    }

    public drawAt(canvas:CanvasRenderingContext2D,point:Point,deltaT:number):void{
        const corners = this.cornersPosition(deltaT);
        for (let i = 0; i < corners.length; i++) {
            corners[i] = corners[i].add(point);
        }

        canvas.beginPath();
        canvas.moveTo(corners[0].x,corners[0].y);
        for (let i = 1; i < this.numSides; i++) {
            canvas.lineTo(corners[i].x,corners[i].y);
        }
        canvas.lineTo(corners[0].x,corners[0].y);
        canvas.stroke();
    }

    private cornersPosition(deltaT:number):Point[]{
        const points:Point[] = [];
        const rotation = this.rotationSpeed * deltaT;
        for (let i = 0; i < this.numSides; i++) {
            const angle = 2 * Math.PI * i / this.numSides;
            const x = this.radius * Math.cos(angle);
            const y = this.radius * Math.sin(angle);
            points.push(this.rotatePoint(new Point(x,y),rotation));
        }
        return points;
    }

    private rotatePoint(point:Point,rotation:number):Point{
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        const x1 = point.x * cos - point.y * sin;
        const y1 = point.x * sin + point.y * cos;
        return new Point(x1,y1);
    }
}


export class FiguresFactory{
    public static createFigure(dto:dto):Figure{
        switch(dto.figureType){
            case FigureType.Circle:
                return new Circle(dto as CircleDTO);
            case FigureType.Square:
                return new NGon(dto as NgonDTO);
            default:
                throw new Error("Invalid figure type");
        }
    }
}