<script lang="ts">
	import SpeedControl from './speedControl.svelte';

	export let min: number = -2;
	export let max: number = 2;
	export let step: number = 0.0025;
	export let label: string = 'Vector';

	export let disableX: boolean = false;
	export let disableY: boolean = false;
	export let disableZ: boolean = false;

	export let x: number, y: number, z: number;
</script>

<SpeedControl
	disabled={disableX}
	bind:value={x}
	{min}
	{max}
	{step}
	label={`${label} X`}
	resetTo={min + (max - min) / 2}
/>
<SpeedControl
	disabled={disableY}
	bind:value={y}
	{min}
	{max}
	label={`${label} Y`}
	{step}
	resetTo={min + (max - min) / 2}
/>
<SpeedControl
	disabled={disableZ}
	bind:value={z}
	{min}
	{max}
	label={`${label} Z`}
	{step}
	resetTo={min + (max - min) / 2}
/>
