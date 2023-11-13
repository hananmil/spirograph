import { DirectionalLight, HemisphereLight, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

import * as THREE from 'three';
import { SimCamera } from './camera';
import { SimLights } from './lights';

export class SimScene {
	private _canvas: HTMLCanvasElement | null = null;
	private _scene: Scene;
	private _renderer: WebGLRenderer | null = null;
	private _camera: SimCamera;
	private _lights: SimLights;

	public onAnimate: (time: DOMHighResTimeStamp) => void = () => { };

	public get scene(): Scene {
		return this._scene;
	}

	constructor() {
		const scene = new THREE.Scene();
		this._scene = scene;
		scene.background = new THREE.Color(0, 0, 0);

		const lights = new SimLights();
		this._lights = lights;
		lights.addToScene(scene);
		
		const camera = new SimCamera();
		this._camera = camera;
		camera.addToScene(scene);
		
	}

	animate = (time: DOMHighResTimeStamp) => {
		requestAnimationFrame(this.animate);
		if (!this._renderer || !this._scene || !this._camera) return;
		this._camera.animate();
		this._lights.animate();
		this.onAnimate(time);
		this._renderer.render(this._scene, this._camera.activeInstance);
	};

	resize() {
		if (!this._canvas) return;
		this._renderer?.setSize(this._canvas.clientWidth, this._canvas.clientHeight);

		if (!this._camera) return;
		this._camera.resize(this._canvas.clientWidth / this._canvas.clientHeight)
		if (!this._renderer || !this._canvas) return;
		this._renderer.setSize(this._canvas.clientWidth, this._canvas.clientHeight);
		// console.log(`Resized to ${this._canvas.clientWidth}x${this._canvas.clientHeight} ratio ${this._canvas.clientWidth / this._canvas.clientHeight}`);
	}

	public createScene(el: HTMLCanvasElement) {
		this._canvas = el;
		this._renderer = new WebGLRenderer({ antialias: true, canvas: el });
		this.resize();
		this.animate(0);
		window.addEventListener('resize', this.resize);
	}
}

