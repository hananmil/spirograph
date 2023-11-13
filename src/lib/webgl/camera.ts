import * as THREE from 'three';
import { SceneComponentBase } from "./sceneComponentBase";
import { cameraFocalDistance, rotateCamera } from '../state';
export class SimCamera extends SceneComponentBase<THREE.Camera> {
	resize(aspect: number) {
		this._camera.aspect = aspect;
		this._camera.updateProjectionMatrix();
	}
	private _camera: THREE.PerspectiveCamera;
	private _rotateCamera: boolean = false;

	public get activeInstance(): THREE.Camera {
		return this._camera;
	}

	constructor() {
		super();
		this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this._camera.position.z = 15;
		this._camera.position.y = 5;
		this._camera.lookAt(0, 0, 0);
		this._camera.updateProjectionMatrix();
		this.items.push(this._camera);
		cameraFocalDistance.subscribe(this._setFocalDistance);
		rotateCamera.subscribe(this._setRotateCamera);
	}

	private _setRotateCamera = (rotateCamera: boolean) => {
		this._rotateCamera = rotateCamera;
	};
	private _setFocalDistance = (focalDistance: number) => {
		this._camera.fov = focalDistance;
		this._camera.lookAt(0, 0, 0);
		this._camera.updateProjectionMatrix();
	};

	override animate = () => {
		if (!this._rotateCamera) {
			return;
		}
		this._camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 0.005);
		this._camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.005);
		this._camera.lookAt(0, 0, 0);

		this._camera.updateProjectionMatrix();

	};
}
