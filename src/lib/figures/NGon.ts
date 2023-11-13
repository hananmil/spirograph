import * as THREE from 'three';
import { type Figure, type NgonDTO, FigureType } from '../figures';

export class NGon implements Figure {
	private radius: number;
	private numSides: number;
	private pointSpeed: number;
	private rotationSpeed: THREE.Vector3;
	private time: number = 0;
	private edgeLength: number;
	private _object3d: THREE.Object3D;
	private _pointMesh: THREE.Mesh;
	public get object3d(): THREE.Object3D {
		return this._object3d;
	}

	constructor(dto: NgonDTO) {
		this.radius = dto.radius;
		this.numSides = dto.numSides;
		this.pointSpeed = dto.pointSpeed;
		this.rotationSpeed = new THREE.Vector3(dto.rotationSpeed.x, dto.rotationSpeed.y, dto.rotationSpeed.z);
		this.edgeLength = 2 * this.radius * Math.sin(Math.PI / this.numSides);

		const corners = this.cornersPosition();
		// corners.push(corners[0]);

		const path = new THREE.CatmullRomCurve3(corners, true, 'catmullrom', 0.01);

		const geometry = new THREE.TubeGeometry(path, 20 * this.numSides, 0.01, 12, true);
		const material = new THREE.MeshBasicMaterial({ color: 4294967295, wireframe: true });

		const obj = new THREE.Object3D();
		obj.add(new THREE.Mesh(geometry, material));
		const pointPosition = this.getLocalPoint();
		const point = new THREE.Mesh(
			new THREE.SphereGeometry(0.03 * this.radius),
			new THREE.MeshBasicMaterial({ color: 0xff0000ff })
		);
		point.position.set(pointPosition.x, pointPosition.y, pointPosition.z);
		obj.add(point);
		this._pointMesh = point;
		this._object3d = obj;
	}

	public figureType(): FigureType {
		return FigureType.Square;
	}

	public getPoint(): THREE.Vector3 {
		const point = this.getLocalPoint();
		// const rotation = this.rotationSpeed.multiplyScalar(this.time);
		const rotationMatrix = new THREE.Matrix4().makeRotationAxis(this.rotationSpeed, this.time);
		const result = point.applyMatrix4(rotationMatrix);
		return result;
	}

	private getLocalPoint(): THREE.Vector3 {
		// Calculate the perimeter of the square
		const perimeter = this.numSides * this.edgeLength;

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
		const p2 = corners[(sideIndex + 1) % this.numSides];

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
		const pointPos = this.getLocalPoint().add(point);
		this._pointMesh.position.set(pointPos.x, pointPos.y, pointPos.z);
        this._object3d.position.set(point.x, point.y, point.z);
		const rotation = this.rotationSpeed * time;
		this._object3d.rotation.set(0, 0, rotation);
	}

	private cornersPosition(): THREE.Vector3[] {
		const points: THREE.Vector3[] = [];
		for (let i = 0; i < this.numSides; i++) {
			const angle = (2 * Math.PI * i) / this.numSides;
			const x = this.radius * Math.cos(angle);
			const y = this.radius * Math.sin(angle);
			points.push(new THREE.Vector3(x, y, 0));
		}
		return points;
	}
}
