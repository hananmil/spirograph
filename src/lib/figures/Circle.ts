import * as THREE from 'three';
import { type Figure, type CircleDTO, FigureType, ReadableDto } from '../figures';
import { FigureBase } from './baseFigure';

export class Circle extends FigureBase<CircleDTO> {
	private radius: number = 0;
	private pointSpeed: number = 0;
	private rotationSpeed: THREE.Vector3 = new THREE.Vector3();
	private time: number = 0;
	private _objectMesh: THREE.Object3D|null = null;

	public get object3d(): THREE.Object3D {
		if (this._objectMesh === null) {
			throw new Error('Object mesh is null');
		}
		return this._objectMesh;
	}

	constructor(readableDTO: ReadableDto<CircleDTO, string>) {
		super(FigureType.Circle, readableDTO);
	}

	public getPoint(): THREE.Vector3 {
		if (this._pointMesh === null) {
			throw new Error('Point mesh is null');
		}
		return this._pointMesh.getWorldPosition(new THREE.Vector3());
	}

	public moveTo(point: THREE.Vector3, time: number): void {
		this.time = time;
		this._objectMesh.position.set(point.x, point.y, point.z);
		const rotationVector = new THREE.Vector3().copy(this.rotationSpeed).multiplyScalar(time);
		const pointLocal = this._getPointLocal();
		this._pointMesh.position.set(pointLocal.x, pointLocal.y, pointLocal.z);
		this._objectMesh.rotation.set(rotationVector.x, rotationVector.y, rotationVector.z);
	}

	protected override initFromDto(dto: CircleDTO): void {
		this.radius = dto.radius;
		this.pointSpeed = dto.pointSpeed;
		this.rotationSpeed = new THREE.Vector3(
			dto.rotationSpeedX,
			dto.rotationSpeedY,
			dto.rotationSpeedZ
		);
		const updatedGeometry = this._updateGeometry(this._objectMesh);
		this._objectMesh = updatedGeometry.obj;
		this._pointMesh = updatedGeometry.point;
	}

	private _getPointLocal(): THREE.Vector3 {
		const result = new THREE.Vector3(
			this.radius * Math.cos(this.time * this.pointSpeed),
			this.radius * Math.sin(this.time * this.pointSpeed),
			0
		);
		return result;
	}

	private _updateGeometry(parent: THREE.Object3D | null): {
		obj: THREE.Object3D;
		point: THREE.Object3D;
	} {
		if (parent !== null) {
			parent.remove(...parent.children);
		}

		const obj = parent ?? new THREE.Object3D();

		const ring = new THREE.TorusGeometry(1, 0.02);
		ring.scale(this.radius, this.radius, this.radius);
		obj.add(new THREE.Mesh(ring, new THREE.MeshBasicMaterial({ color: 0xffffffff })));
		const point = new THREE.Mesh(
			new THREE.SphereGeometry(0.05 * this.radius),
			new THREE.MeshBasicMaterial({ color: 0xff0000ff })
		);
		this._pointMesh = point;
		obj.add(point);
		point.position.set(this.radius, 0, 0);
		return { obj, point };
	}
}
