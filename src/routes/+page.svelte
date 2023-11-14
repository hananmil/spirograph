<script lang="ts">
	import Paper, { Title, Subtitle, Content as PaperContent } from '@smui/paper';
	import { type Figure, FiguresFactory } from '$lib';
	import { onMount } from 'svelte';
	import { Canvas } from '@threlte/core'
	import SideBar from './sideBar.svelte';
	import { figuresData, stateStore, isPaused, stepsPerSecond } from '$lib/state';
	import * as THREE from 'three';
	import Scene from './Scene.svelte';


	let figures: Figure[] = [];
	figuresData.subscribe((fd) => {
		console.log('figuresData updated');
		for (let i = 0; i < figures.length; i++) {
			// scene.scene.remove(figures[i].object3d);
		}
		// if (!scene) return;
		figures = fd.map((data) => {
			const fig = FiguresFactory.createFigure(data);
			// scene.scene.add(fig.object3d);
			return fig;
		});
	});

	function reset() {
		initial_draw();
	}

	function step() {
		if ($isPaused) {
			return;
		}

		let location = new THREE.Vector3(0, 0, 0);

		for (let fig of figures) {
			fig.moveTo(location, $stateStore.time);
			location = fig.pointPosition();
		}

		stateStore.updateTime((time: number) => {
			const timeFactor = 0.01;
			return time + timeFactor * (2 * Math.PI);
		});
	}

	function initial_draw() {
		createAxis(0, 0xffe4f1ee);
		createAxis(1, 0xffd9edf8);
		createAxis(2, 0xfffdffb6);
	}

	function createAxis(
		axis: number,
		color: number,
		min: number = -100,
		max: number = 100,
		ticksDistance: number = 1,
		tickLen: number = 0.13
	) {
		// let lineFactory = new TwoPointsLineFactory(color, 0.08);
		// let p1 = new THREE.Vector3().setComponent(axis, min);
		// let p2 = new THREE.Vector3().setComponent(axis, max);
		// const axisMesh = lineFactory.createTwoPointLine(p1, p2);
		
		// lineFactory = new TwoPointsLineFactory(color, 0.02);
		// let tickPossition = (max - min) / ticksDistance;
		// for (let axis2 = 0; axis2 < 3; axis2++) {
		// 	for (let i = 0; i <= tickPossition; i++) {
		// 		p1 = new THREE.Vector3().setComponent(axis, min + i * ticksDistance);
		// 		p2 = new THREE.Vector3().setComponent(axis, min + i * ticksDistance);
		// 		p1.setComponent((axis + axis2) % 3, -tickLen);
		// 		p2.setComponent((axis + axis2) % 3, tickLen);
		// 		axisMesh.add(lineFactory.createTwoPointLine(p1, p2));
		// 	}
		// }
		// scene.scene.add(axisMesh);
	}


	function resize() {
		// sceneCanvas.width = window.innerWidth - 300;
		// sceneCanvas.height = window.innerHeight;
		// scene.resize();
		// console.log(`resize ${window.innerWidth} ${window.innerHeight}`);
		reset();
	}

	onMount(() => {
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
		<Canvas>
			<Scene/>
		</Canvas>
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
