<script lang="ts">
	import Paper, { Title, Subtitle, Content as PaperContent } from '@smui/paper';
	import { type Figure, FiguresFactory } from '$lib';
	import { onMount } from 'svelte';
	import { Canvas } from '@threlte/core'
	import SideBar from './sideBar.svelte';
	import { stateStore, isPaused, stepsPerSecond } from '$lib/state';
	import Scene from './Scene.svelte';

	function step() {
		if ($isPaused) {
			return;
		}
		stateStore.updateTime((time: number) => {
			const timeFactor = 0.01;
			return time + timeFactor * (2 * Math.PI);
		});
	}

	onMount(() => {
		let interval: number | undefined;
		stepsPerSecond.subscribe((sps) => {
			if (interval) {
				clearInterval(interval);
			}
			interval = setInterval(() => {
				step();
			}, 1000 / sps);
		});
		return () => {
			clearInterval(interval);
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
