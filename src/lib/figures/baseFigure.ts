import type { DTO, Figure, FigureType, ReadableDto } from '$lib';
import type { Vector3, Object3D, Object3DEventMap } from 'three';
import * as THREE from 'three';
export abstract class FigureBase implements Figure {
	protected pointMesh: THREE.Object3D;

	protected size: number = 0;
	protected pointSpeed: number = 0;
	protected rotationSpeed: THREE.Vector3 = new THREE.Vector3();

	constructor(public figureType: FigureType, protected dto: ReadableDto<DTO>) {
		const point = new THREE.Mesh(
			new THREE.SphereGeometry(0.05 * dto.dtoWrapper.size),
			new THREE.MeshBasicMaterial({ color: 0xff0000ff })
		);
		this.pointMesh = point;

		this.initFromDto(dto.dtoWrapper);
		dto.subscribe(this.initFromDto);
	}

	public abstract moveTo(point: Vector3, time: number): void;

	public abstract get object3d(): Object3D<Object3DEventMap>;

	public pointPosition(): THREE.Vector3 {
		if (this.pointMesh === null) {
			throw new Error('Point mesh is null');
		}
		return this.pointMesh.getWorldPosition(new THREE.Vector3());
	}

	protected initFromDto(dto: DTO): void {
		this.size = dto.size;
		this.pointSpeed = dto.pointSpeed;
		this.rotationSpeed.set(dto.rotationSpeedX, dto.rotationSpeedY, dto.rotationSpeedZ);
	}
}
