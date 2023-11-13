import type * as THREE from 'three';
import {
	type Readable,
	type Writable,
	writable,
	type Invalidator,
	type Subscriber,
	type Unsubscriber,
	get
} from 'svelte/store';

export enum FigureType {
	Circle,
	Square,
	Lline,
	Triangle
}
export interface DTOVector {
	x: number;
	y: number;
	z: number;
}
export interface Figure {
	figureType(): FigureType;
	getPoint(): THREE.Vector3;
	moveTo(point: THREE.Vector3, time: number): void;
	get object3d(): THREE.Object3D;
}

export interface DTO extends Record<string | symbol, unknown> {
	figureType: FigureType;
	rotationSpeedX: number;
	rotationSpeedY: number;
	rotationSpeedZ: number;
	pointSpeed: number;
}

export interface CircleDTO extends DTO {
	radius: number;
}

export interface NgonDTO extends DTO {
	radius: number;
	numSides: number;
}

export class ReadableDto<DTO extends Record<string | symbol, unknown>, T extends keyof DTO>
	implements Readable<DTO>
{
	[key: string | symbol]: unknown;
	private _subscribeList: Subscriber<DTO>[];
	private _dto: Writable<DTO>;

	public get dtoWrapper(): DTO {
		return this as unknown as DTO;
	}

	constructor(dto: DTO) {
		this._subscribeList = [];
		this._dto = writable(dto);
		for (const key in dto) {
			Object.defineProperty(this, key, this._createDynamicSetter(key));
		}
	}

	public subscribe(run: Subscriber<DTO>, invalidate?: Invalidator<DTO> | undefined): Unsubscriber {
		this._subscribeList.push(run);
		return this._dto.subscribe(run, invalidate);
	}

	private _createDynamicSetter = (propertyName: string | symbol) => {
		return {
			set(this: ReadableDto<DTO, T>, newValue: DTO[T]) {
				console.log(`Setting ${String(propertyName)} to ${newValue}`);
				// Custom logic for the setter
				this._dto.update((dto: DTO) => {
					Object.assign(dto, { [propertyName]: newValue });
					return dto;
				});
				this._subscribeList.forEach((subscriber: Subscriber<DTO>) => {
					console.log(`Calling subscriber for ${String(propertyName)} updated`);
					subscriber(this.dtoWrapper);
				});
			},
			get(this: ReadableDto<DTO, T>): DTO[T] {
				console.log(
					`Getting ${String(propertyName)} to ${JSON.stringify(get(this._dto)[propertyName])}`
				);
				return get(this._dto)[propertyName] as DTO[T];
			}
		};
	};
}
