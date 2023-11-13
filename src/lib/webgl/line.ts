import * as THREE from 'three';

export class Line {
	private geometry: THREE.BufferGeometry;
	private numVertices: number = 0;
	private material: THREE.LineBasicMaterial;
	private lineObject: THREE.Object3D | null = null;
	constructor(maxVertices: number, color: number) {
		this.material = new THREE.LineBasicMaterial({ color });

		const buffer = new Float32Array(maxVertices * 3);

		this.geometry = new THREE.BufferGeometry();
		this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(buffer, 3));
		this.geometry.setDrawRange(0, this.numVertices);
	}

	public addVertex(x: number, y: number, z: number) {
		const positions = this.geometry.getAttribute('position') as THREE.Float32BufferAttribute;
		positions.setXYZ(this.numVertices, x, y, z);
		this.numVertices++;
		positions.needsUpdate = true;
		this.geometry.setDrawRange(0, this.numVertices);
	}

	public get line():THREE.Object3D {
		if (!this.lineObject) {
			this.lineObject = new THREE.Line(this.geometry, this.material);
			this.lineObject.frustumCulled = true;
		}
		return this.lineObject;
	}
}
