import type * as THREE from 'three';
import {type Readable,type Writable,writable,readable, type Invalidator, type Subscriber, type Unsubscriber} from 'svelte/store';

export enum FigureType{
    Circle,
    Square,
    Lline,
    Triangle,
}
export interface DTOVector{
    x:number;
    y:number;
    z:number;
}
export interface Figure {
    figureType():FigureType;
    getPoint(): THREE.Vector3;
    moveTo(point:THREE.Vector3,time:number):void;
    get object3d(): THREE.Object3D ;
}

export interface DTO{
    figureType:FigureType;
    rotationSpeed:DTOVector;
    pointSpeed:number;
}

export interface CircleDTO extends DTO{
    radius:number;
}

export interface NgonDTO extends DTO{
    radius:number;
    numSides:number;
}

export class ReadableDto<DTO extends {}> implements Readable<DTO>
{
    [key: string | number | symbol]: unknown;
    private _subscribeList: Subscriber<DTO>[];
    private _dto:Writable<DTO>;

    public get dtoWrapper():DTO{
        return this as any as DTO;
    }

    constructor(dto:DTO){
        this._subscribeList = [];
        this._dto = writable(dto);
        for (let key in dto){
            Object.defineProperty(this, key, this._createDynamicSetter(key));
        }
    }
    
    public subscribe(run: Subscriber<DTO>, invalidate?: Invalidator<DTO> | undefined): Unsubscriber {
        this._subscribeList.push(run);
        return this._dto.subscribe(run,invalidate);
    }


    private _createDynamicSetter = <T extends keyof DTO>(propertyName: T) => {
        return {
            set(this: any, newValue: DTO[T]) {
                // Custom logic for the setter
                this._dto.update((dto: DTO) => {
                    Object.assign(dto, { [propertyName]: newValue });
                    return dto;
                });
                this._subscribeList.forEach((subscriber:Subscriber<DTO>) => {
                    subscriber(this.dtoWrapper);
                });
            },
            get(this: any): DTO[T] {
                return this._dto[propertyName];
            },
        };
    };
}

