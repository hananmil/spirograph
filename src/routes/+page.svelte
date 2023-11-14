<script lang="ts">
	import Paper, { Title, Subtitle, Content as PaperContent } from '@smui/paper';
	import { type Figure, FiguresFactory } from '$lib';
	import { onMount } from 'svelte';

	import SideBar from './sideBar.svelte';
	import { figuresData, stateStore, isPaused, stepsPerSecond } from '$lib/state';
	import { SimScene } from '../lib/webgl/scene';
	import { TwoPointsLineFactory } from '../lib/webgl/line';
	import * as THREE from 'three';

	let sceneCanvas: HTMLCanvasElement;

	let scene: SimScene;
	// let trace: Line;
	let lineGeometry: THREE.Object3D;

	let figures: Figure[] = [];
	figuresData.subscribe((fd) => {
		console.log('figuresData updated');
		for (let i = 0; i < figures.length; i++) {
			scene.scene.remove(figures[i].object3d);
		}
		if (!scene) return;
		figures = fd.map((data) => {
			const fig = FiguresFactory.createFigure(data);
			scene.scene.add(fig.object3d);
			return fig;
		});
	});

	function reset() {
		// console.log('reset');
		if (!scene) return;

		if (lineGeometry) {
			scene.scene.remove(lineGeometry);
		}
		// trace = new Line(100000, 0xffff00ff);
		initial_draw();
	}

	function step() {
		if ($isPaused) {
			return;
		}

		let location = new THREE.Vector3(0, 0, 0);

		for (let fig of figures) {
			fig.moveTo(location, $stateStore.time);
			location = fig.getPoint();
		}

		// trace.addVertex(location.x, location.y, location.z);
		// if (trace.count == 2)
		// {
		// 	lineGeometry = trace.line;
		// 	scene.scene.add(lineGeometry);
		// }

		stateStore.updateTime((time: number) => {
			const timeFactor = 0.01;
			return time + timeFactor * (2 * Math.PI);
		});
	}

	function initial_draw() {
		createAxis(0, 0xffff0000);
		createAxis(1, 0xff00ff00);
		createAxis(2, 0xff0000ff);
	}

	function createAxis(
		axis: number,
		color: number,
		min: number = -100,
		max: number = 100,
		ticksDistance: number = 1,
		tickLen: number = 0.13
	) {
		let lineFactory = new TwoPointsLineFactory(color, 0.08);
		let p1 = new THREE.Vector3().setComponent(axis, min);
		let p2 = new THREE.Vector3().setComponent(axis, max);
		scene.scene.add(lineFactory.createTwoPointLine(p1, p2));

		lineFactory = new TwoPointsLineFactory(color, 0.05);
		let tickPossition = (max - min) / ticksDistance;
		for (let axis2 = 0; axis2 < 3; axis2++) {
			for (let i = 0; i <= tickPossition; i++) {
				p1 = new THREE.Vector3().setComponent(axis, min + i * ticksDistance);
				p2 = new THREE.Vector3().setComponent(axis, min + i * ticksDistance);
				p1.setComponent((axis + axis2) % 3, -tickLen);
				p2.setComponent((axis + axis2) % 3, tickLen);
				scene.scene.add(lineFactory.createTwoPointLine(p1, p2));
			}
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
		let interval: number | undefined;
		stepsPerSecond.subscribe((sps) => {
			if (interval) {
				clearInterval(interval);
			}
			interval = setInterval(() => {
				step();
			}, 1000 / sps);
		});
		window.onresize = () => resize();
		resize();
		return () => {
			clearInterval(interval);
		};
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
