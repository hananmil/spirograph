<script lang="ts">
	import Paper, { Title, Subtitle, Content as PaperContent } from '@smui/paper';
	import { Point, type Figure, FiguresFactory } from '$lib';
	import { onMount } from 'svelte';

	import SideBar from './sideBar.svelte';
	import { figuresData, stateStore, isPaused, showDots, showFigures } from '$lib/state';
	import { SceneBuilder } from './webgl/scene';
	import { Line } from './webgl/line';

	let fixedCanvas: HTMLCanvasElement;
	let shapeCanvas: HTMLCanvasElement;
	let frameCanvas: HTMLCanvasElement;
	let sceneCanvas: HTMLCanvasElement;

	let figures: Figure[] = $figuresData.map((data) => FiguresFactory.createFigure(data));
	let pausedValue = $isPaused;
	let showDotsValue = $showDots;
	let showFiguresValue = $showFigures;
	let timeValue = $stateStore.time;

	let scene: SceneBuilder;

	function reset() {
		const shapeCtx = shapeCanvas.getContext('2d');
		if (!shapeCtx) throw new Error('No context');
		shapeCanvas.getContext('2d')?.reset();
		frameCanvas.getContext('2d')?.reset();
		let lp = new Point(0, 0);
		for (let i = 0; i < figures.length; i++) {
			let point = figures[i].getPoint(0);
			lp = lp.add(point);
		}
		stateStore.resetState();
		stateStore.updateLastPoint(() => lp);
		initial_draw();
	}

	function drawFrame(frameCtx: CanvasRenderingContext2D): Point {
		frameCtx.reset();
		frameCtx.font = '32px serif';
		frameCtx.strokeText('Time ' + timeValue.toFixed(3), 40, 40);

		let location: Point = new Point(frameCtx.canvas.width / 2, frameCtx.canvas.height / 2);

		for (let i = 0; i < figures.length; i++) {
			const figure = figures[i];
			if (showFiguresValue) {
				figure.drawAt(frameCtx, location, timeValue);
			}
			const point = figure.getPoint(timeValue);
			location = location.add(point);
			if (showDotsValue) {
				frameCtx.beginPath();
				frameCtx.arc(location.x, location.y, 5, 0, 2 * Math.PI);
				frameCtx.fillStyle = 'red';
				frameCtx.fill();
				frameCtx.closePath();
			}
		}
		return location;
	}

	function drawStroke(ctx: CanvasRenderingContext2D, location: Point) {
		if (!ctx) throw new Error('No context');
		ctx.beginPath();
		stateStore.updateLastPoint((lastPoint: Point) => {
			if (!ctx) throw new Error('Lost context');
			ctx.moveTo(lastPoint.x, lastPoint.y);
			ctx.lineTo(location.x, location.y);
			return location;
		});
		ctx.stroke();
		ctx.closePath();
	}

	function step() {
		if (!shapeCanvas || !frameCanvas) return;

		const frameCtx = frameCanvas.getContext('2d');
		if (!frameCtx) throw new Error('No context');
		const location: Point = drawFrame(frameCtx);
		if (pausedValue) {
			return;
		}
		const shapeCtx = shapeCanvas.getContext('2d');
		if (!shapeCtx) throw new Error('No context');

		stateStore.updateTime((time: number) => {
			if (!shapeCtx) throw new Error('Lost context');
			const timeFactor = 1;
			return time + timeFactor * (2 * Math.PI);
		});
		drawStroke(shapeCtx, location);
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
		scene.scene.add(axis_x.createLine());
		scene.scene.add(axis_y.createLine());
		scene.scene.add(axis_z.createLine());
	}

	function resize() {
		fixedCanvas.width = window.innerWidth - 300;
		fixedCanvas.height = window.innerHeight;
		shapeCanvas.width = window.innerWidth - 300;
		shapeCanvas.height = window.innerHeight;
		frameCanvas.width = window.innerWidth - 300;
		frameCanvas.height = window.innerHeight;
		console.log(`resize ${window.innerWidth} ${window.innerHeight}`);
		reset();
	}

	onMount(() => {
		scene = new SceneBuilder();
		scene.createScene(sceneCanvas);
		reset();
		const interval = setInterval(() => {
			step();
			if (timeValue > 3000) {
				clearInterval(interval);
			}
		}, 10);
		window.onresize = () => resize();
		resize();
		return () => {
			// clearInterval(interval);
		};
	});
</script>

<div class="drawer-container app-content">
	<Paper>
		<PaperContent>
			<SideBar />
		</PaperContent>
	</Paper>

	<main>
		<canvas bind:this={fixedCanvas} />
		<canvas bind:this={shapeCanvas} />
		<canvas bind:this={sceneCanvas} />
		<canvas bind:this={frameCanvas} />
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
