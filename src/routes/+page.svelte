<script lang="ts">
	import Paper, { Title, Subtitle, Content as PaperContent } from '@smui/paper';
	import { type Figure, FiguresFactory } from '$lib';
	import { onMount } from 'svelte';

	import SideBar from './sideBar.svelte';
	import { figuresData, stateStore, isPaused, stepsPerSecond } from '$lib/state';
	import { SimScene } from '../lib/webgl/scene';
	import { Line } from '../lib/webgl/line';
	import * as THREE from 'three';

	let sceneCanvas: HTMLCanvasElement;

	let scene: SimScene;
	let trace: Line;
	let lineGeometry: THREE.Object3D;

	let figures: Figure[] = [];
	figuresData.subscribe((fd) => {
		console.log('figuresData updated');
		for (let i = 0; i < figures.length; i++) {
			scene.scene.remove(figures[i].object3d);
		}
		if (!scene) return;
		figures = fd.map((data) => {
			const fig = FiguresFactory.createFigure(data)
			scene.scene.add(fig.object3d);
			return fig;
		});
	});

	function reset() {
		// console.log('reset');
		if (!scene) return;

		if (lineGeometry){
			scene.scene.remove(lineGeometry);
		}
		trace = new Line(100000, 0xffff00ff);
		lineGeometry = trace.line;
		scene.scene.add(lineGeometry);
		initial_draw();
	}


	function step() {
		if ($isPaused) {
			return;
		}

		let location = new THREE.Vector3(0, 0, 0);

		for (let fig of figures) {
			fig.moveTo(location, $stateStore.time);
			const point = fig.getPoint();
			location = location.add(point);
		}

		trace.addVertex(location.x, location.y, location.z);


		stateStore.updateTime((time: number) => {
			const timeFactor = 0.01;
			return time + timeFactor * (2 * Math.PI);
		});
	}

	function initial_draw() {
		if (!scene) return;
		const axis_x = new Line(2, 0xffff0000);
		const axis_y = new Line(2, 0xffffff00);
		const axis_z = new Line(2, 0xff00ffff);
		axis_x.addVertex(-100, 0, 0);
		axis_x.addVertex(100, 0, 0);
		axis_y.addVertex(0, -100, 0);
		axis_y.addVertex(0, 100, 0);
		axis_z.addVertex(0, 0, -100);
		axis_z.addVertex(0, 0, 100);
		scene.scene.add(axis_x.line);
		scene.scene.add(axis_y.line);
		scene.scene.add(axis_z.line);

		for (let i = -100; i <= 100; i++) {
			let line = new Line(2, 0xff00ffff);
			line.addVertex(-0.1, 0, i);
			line.addVertex(0.1, 0, i);
			scene.scene.add(line.line);
			let line2 = new Line(2, 0xffff0000);
			line2.addVertex(i, 0, -0.1);
			line2.addVertex(i, 0, 0.1);
			scene.scene.add(line2.line);
			let line3 = new Line(2, 0xffffff00);
			line3.addVertex(-0.1, i, 0);
			line3.addVertex(0.1, i, 0);
			scene.scene.add(line3.line);
		}
	}

	function resize() {
		sceneCanvas.width = window.innerWidth - 300;
		sceneCanvas.height = window.innerHeight;
		scene.resize();
		// console.log(`resize ${window.innerWidth} ${window.innerHeight}`);
		reset();
	}



	onMount(() => {
		scene = new SimScene();
		scene.createScene(sceneCanvas);
		reset();
		let interval:number|undefined;
		stepsPerSecond.subscribe((sps) => {
			if (interval) {
				clearInterval(interval);
			}
			interval = setInterval(() => {
				step();
				}, 1000/sps);
		});
		window.onresize = () => resize();
		resize();
		return () => { clearInterval(interval); };
	});
</script>

<div class="drawer-container app-content">
	<Paper>
		<PaperContent>
			<SideBar {reset} />
		</PaperContent>
	</Paper>

	<main>
		<canvas bind:this={sceneCanvas} />
	</main>
</div>

<style lang="less">
	.drawer-container {
		position: relative;
		display: flex;
		height: 100%;
		overflow: hidden;
		z-index: 0;
	}

	main {
		position: relative;
		background-color: whitesmoke;
		width: 100%;
		height: 100%;
	}

	canvas {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	* :global(.mdc-card) {
		margin-bottom: 1em;
		padding: 1em;
	}

	* :global(.app-content) {
		flex: auto;
		overflow: auto;
		position: relative;
		flex-grow: 1;
	}
</style>
