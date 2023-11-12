import { DirectionalLight, HemisphereLight, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

import * as THREE from 'three';

export class SceneBuilder {
	private _canvas: HTMLCanvasElement | null = null;
	private _scene: Scene;
	private _camera: PerspectiveCamera | null = null;
	private _renderer: WebGLRenderer | null = null;

	public get scene(): Scene {
		return this._scene;
	}

	constructor() {
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0, 0, 0);
		const vertices = [];
		const divisions = 150;

		for (let i = 0; i <= divisions; i++) {
			const v = (i / divisions) * (Math.PI * 2) * 4;

			const x = Math.sin(v);
			const z = Math.cos(v);

			vertices.push(x, Math.sqrt(i), z);
		}

		const geometry = new THREE.BufferGeometry();
		const buff = new THREE.Float32BufferAttribute(vertices, 3);
		geometry.setAttribute('position', buff);

		for (let i = 1; i <= 13; i++) {
			const material = new THREE.LineBasicMaterial(<THREE.LineBasicMaterialParameters>{
				color: Math.random() * 0x0fffff,
				linewidth: 100
			});
			const line = new THREE.Line(geometry, material);
			line.scale.setScalar(i / 13 / 2);
			scene.add(line);
		}

		const directionalLight = new DirectionalLight(0x9090aa);
		directionalLight.position.set(-10, 10, -10).normalize();
		scene.add(directionalLight);

		const hemisphereLight = new HemisphereLight(0xffffff, 0x444444);
		hemisphereLight.position.set(1, 1, 1);
		hemisphereLight.intensity = 6;
		scene.add(hemisphereLight);
		this._scene = scene;
	}

	animate = () => {
		requestAnimationFrame(this.animate);
		if (!this._renderer || !this._scene || !this._camera) return;

		this._camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 0.01);
		this._camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.01);
		this._renderer.render(this._scene, this._camera);
	};

	resize() {
		if (!this._canvas) return;
		this._renderer?.setSize(this._canvas.clientWidth, this._canvas.clientHeight);

		if (!this._camera) return;
		this._camera.aspect = this._canvas.clientWidth / this._canvas.clientHeight;
		this._camera.updateProjectionMatrix();
	}

	public createScene(el: HTMLCanvasElement) {
		this._canvas = el;
		const camera = new THREE.PerspectiveCamera(33, el.clientWidth / el.clientHeight, 0.1, 100);
		camera.position.z = 15;
		camera.position.y = 3;
		this._camera = camera;

		this._renderer = new WebGLRenderer({ antialias: true, canvas: el });
		this.resize();
		this.animate();
		window.addEventListener('resize', this.resize);
	}
}
