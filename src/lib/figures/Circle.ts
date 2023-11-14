import * as THREE from 'three';
import { type CircleDTO, FigureType, ReadableDto } from '../figures';
import { FigureBase } from './baseFigure';

export class Circle extends FigureBase {
	private time: number = 0;
	private _objectMesh: THREE.Object3D | null = null;

	public get object3d(): THREE.Object3D {
		if (this._objectMesh === null) {
			throw new Error('Object mesh is null');
		}
		return this._objectMesh;
	}

	constructor(readableDTO: ReadableDto<CircleDTO>) {
		super(FigureType.Circle, readableDTO);
	}

	public moveTo(point: THREE.Vector3, time: number): void {
		if (!this._objectMesh) {
			throw new Error('Object mesh is null');
		}
		this.time = time;

		this._objectMesh.position.set(point.x, point.y, point.z);
		const rotationVector = new THREE.Vector3().copy(this.rotationSpeed).multiplyScalar(time);
		this._objectMesh.rotation.set(rotationVector.x, rotationVector.y, rotationVector.z);

		const pointLocal = this._getPointLocal();
		this.pointMesh.position.set(pointLocal.x, pointLocal.y, pointLocal.z);
	}

	protected override initFromDto(dto: CircleDTO): void {
		super.initFromDto(dto);
		const updatedGeometry = this._updateGeometry(this._objectMesh);
		this._objectMesh = updatedGeometry.obj;
		this.pointMesh = updatedGeometry.point;
	}

	private _getPointLocal(): THREE.Vector3 {
		const result = new THREE.Vector3(
			this.size * Math.cos(this.time * this.pointSpeed),
			this.size * Math.sin(this.time * this.pointSpeed),
			0
		);
		return result;
	}

	private _updateGeometry(parent: THREE.Object3D | null): {
		obj: THREE.Object3D;
		point: THREE.Object3D;
	} {
		if (parent !== null && this._objectMesh !== null) {
			parent.remove(this._objectMesh);
		}

		const obj = parent ?? new THREE.Object3D();

		const ring = new THREE.TorusGeometry(1, 0.02);
		ring.scale(this.size, this.size, this.size);
		obj.add(new THREE.Mesh(ring, new THREE.MeshBasicMaterial({ color: 0xffffffff })));

		obj.add(this.pointMesh);
		this.pointMesh.position.set(this.size, 0, 0);
		return { obj, point: this.pointMesh };
	}
}
