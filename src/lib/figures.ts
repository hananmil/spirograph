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
	NGon,
}
export interface DTOVector {
	x: number;
	y: number;
	z: number;
}
export interface Figure {
	figureType: FigureType;
	pointPosition(): THREE.Vector3;
	moveTo(point: THREE.Vector3, time: number): void;
	get object3d(): THREE.Object3D;
}

export interface DTO extends Record<string | symbol, unknown> {
	figureType: FigureType;
	size: number;
	rotationSpeedX: number;
	rotationSpeedY: number;
	rotationSpeedZ: number;
	pointSpeed: number;
}

export interface CircleDTO extends DTO {}

export interface NgonDTO extends DTO {
	numCorners: number;
}
