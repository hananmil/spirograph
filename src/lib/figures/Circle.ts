import * as THREE from 'three';
import {type Figure, type CircleDTO, FigureType } from '../figures';


export class Circle implements Figure {
    private radius: number;
    private pointSpeed: number;
    private rotationSpeed: THREE.Vector3;
    private time: number = 0;
    private _objectMesh: THREE.Object3D;
    private _pointMesh: THREE.Object3D;

    public get object3d(): THREE.Object3D {
        return this._objectMesh;
    }

    constructor(dto: CircleDTO) {
        this.radius = dto.radius;
        this.pointSpeed = dto.pointSpeed;
        this.rotationSpeed = new THREE.Vector3(dto.rotationSpeed.x, dto.rotationSpeed.y, dto.rotationSpeed.z);
        const ring = new THREE.TorusGeometry(1, 0.01);
        ring.scale(this.radius, this.radius, this.radius);
        const obj = new THREE.Object3D()
        obj.add(new THREE.Mesh(ring, new THREE.MeshBasicMaterial({ color: 0xffffffff })));
        const point = new THREE.Mesh(new THREE.SphereGeometry(0.05*this.radius), new THREE.MeshBasicMaterial({ color: 0xff0000ff }));
        this._pointMesh = point;
        obj.add(point);
        point.position.set(this.radius, 0, 0);
        this._objectMesh = obj;
    }

    public figureType(): FigureType {
        return FigureType.Circle;
    }

    public getPoint(): THREE.Vector3 {
        return this._pointMesh.getWorldPosition(new THREE.Vector3());
    }

    public moveTo(point: THREE.Vector3, time: number): void {
        this.time = time;
        this._objectMesh.position.set(point.x, point.y, point.z);
        const rotationVector = new THREE.Vector3().copy(this.rotationSpeed).multiplyScalar(time);
        this._objectMesh.rotation.set(rotationVector.x, rotationVector.y, rotationVector.z); 
    }

    private _getPointLocal(): THREE.Vector3 {
        const result = new THREE.Vector3(
            this.radius * Math.cos(this.time * this.pointSpeed),
            this.radius * Math.sin(this.time * this.pointSpeed),
            0
        );
        return result;
    }
}
