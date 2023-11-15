import * as THREE from 'three';
import { type Figure, type NgonDTO, FigureType, ReadableDto } from '../figures';

export class NGon implements Figure {
	private radius: number = 1;
	private numCorners: number = 4;
	private pointSpeed: number = 0;
	private rotationSpeed: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
	private time: number = 0;
	private edgeLength: number = 0;
	private _object3d: THREE.Object3D;
	private _pointMesh: THREE.Object3D;

	public get object3d(): THREE.Object3D {
		return this._object3d;
	}

	constructor(readableDTO: ReadableDto<NgonDTO, string>) {
		const dto = readableDTO.dtoWrapper;

		readableDTO.subscribe((dto: NgonDTO) => {
			this._initFromDTO(dto);
			const updatedGeometry = this._updateGeometry(this._object3d);
			this._object3d = updatedGeometry.obj;
			this._pointMesh = updatedGeometry.point;
		});
		this._initFromDTO(dto);
		const updatedGeometry = this._updateGeometry();
		this._object3d = updatedGeometry.obj;
		this._pointMesh = updatedGeometry.point;
	}

	private _updateGeometry(parent:THREE.Object3D|null = null): {obj:THREE.Object3D,point:THREE.Object3D} {
		const corners = this.cornersPosition();
		if (parent !== null) {
			parent.remove(...parent.children);
		}
		const obj = parent ?? new THREE.Object3D();
		const path = new THREE.CatmullRomCurve3(corners, true, 'catmullrom', 0.01);

		const geometry = new THREE.TubeGeometry(path, 20 * this.numCorners, 0.01, 12, true);
		const material = new THREE.MeshBasicMaterial({ color: 4294967295, wireframe: true });

		obj.add(new THREE.Mesh(geometry, material));
		const pointPosition = this.getLocalPoint();
		const point = new THREE.Mesh(
			new THREE.SphereGeometry(0.03 * this.radius),
			new THREE.MeshBasicMaterial({ color: 0xff0000ff })
		);
		point.position.set(pointPosition.x, pointPosition.y, pointPosition.z);
		obj.add(point);
		return {obj, point};
	}

	private _initFromDTO(dto: NgonDTO): void {
		this.radius = dto.radius;
		this.numCorners = dto.numCorners;
		this.pointSpeed = dto.pointSpeed;
		this.rotationSpeed = new THREE.Vector3(
			dto.rotationSpeedX,
			dto.rotationSpeedY,
			dto.rotationSpeedZ
		);
		this.edgeLength = 2 * this.radius * Math.sin(Math.PI / this.numCorners);
	}

	public figureType(): FigureType {
		return FigureType.NGon;
	}

	public getPoint(): THREE.Vector3 {
		return this._pointMesh.getWorldPosition(this._pointMesh.position.clone());
	}

	private getLocalPoint(): THREE.Vector3 {
		// Calculate the perimeter of the square
		const perimeter = this.numCorners * this.edgeLength;

		const speed = (this.pointSpeed * perimeter) / (2 * Math.PI);

		// Calculate the distance traveled
		let distanceTraveled = (speed * this.time) % perimeter;

		while (distanceTraveled < 0) {
			distanceTraveled += perimeter;
		}

		// Determine the side of the square the point is on
		const sideIndex = Math.floor(distanceTraveled / this.edgeLength);

		// Determine the position on that side
		const positionOnSide = distanceTraveled % this.edgeLength;
		const corners = this.cornersPosition();
		const p1 = corners[sideIndex];
		const p2 = corners[(sideIndex + 1) % this.numCorners];

		// Determine the point coordinates
		const point = p2
			.sub(p1)
			.multiplyScalar(positionOnSide / this.edgeLength)
			.add(p1);

		// Return the new point
		return point;
	}

	public moveTo(point: THREE.Vector3, time: number): void {
		this.time = time;
		const pointPos = this.getLocalPoint();
		const rotationVector = new THREE.Vector3().copy(this.rotationSpeed).multiplyScalar(time);
		this._object3d.rotation.set(rotationVector.x, rotationVector.y, rotationVector.z);
		this._object3d.position.set(point.x, point.y, point.z);
		this._pointMesh.position.set(pointPos.x, pointPos.y, pointPos.z);
		// const rotation = this.rotationSpeed * time;
		// this._object3d.rotation.set(0, 0, rotation);
	}

	private cornersPosition(): THREE.Vector3[] {
		const points: THREE.Vector3[] = [];
		for (let i = 0; i < this.numCorners; i++) {
			const angle = (2 * Math.PI * i) / this.numCorners;
			const x = this.radius * Math.cos(angle);
			const y = this.radius * Math.sin(angle);
			points.push(new THREE.Vector3(x, y, 0));
		}
		return points;
	}
}
