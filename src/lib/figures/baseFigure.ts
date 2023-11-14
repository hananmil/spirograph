import type { Figure, FigureType, ReadableDto } from "$lib";
import type { Vector3, Object3D, Object3DEventMap } from "three";
import * as THREE from "three";
export abstract class FigureBase<DTO extends Record<string | symbol, unknown> implements DTO> implements Figure{
    private _pointMesh: THREE.Object3D ;

    constructor(public figureType:FigureType, protected dto:ReadableDto<DTO>) {
         dto.dtoWrapper as DTO
        this.initFromDto(dto.dtoWrapper);
        dto.subscribe(this.initFromDto);
        const point = new THREE.Mesh(
			new THREE.SphereGeometry(0.05 * this.size),
			new THREE.MeshBasicMaterial({ color: 0xff0000ff })
		);
		this._pointMesh = point;

    }

    public abstract pointPosition(): Vector3;

    public abstract moveTo(point: Vector3, time: number): void;

    public abstract get object3d(): Object3D<Object3DEventMap> ;

    protected abstract initFromDto(dto:DTO):void;

}