<script lang="ts">
	import { Label } from '@smui/button';
	import FormField from '@smui/form-field';
	import Slider from '@smui/slider';
	import type * as THREE from 'three';
	import SpeedControl from './speedControl.svelte';

	export let min: number = -2;
	export let max: number = 2;
	export let step: number = 0.0025;
	export let label: string = 'Vector';
	export let onchange: (v: THREE.Vector3) => void = (v) =>  
	{
		console.log('onchange not implemented', v.toArray());
	};

	export let disableX: boolean = false;
	export let disableY: boolean = false;
	export let disableZ: boolean = false;

	export let vector: THREE.Vector3;
</script>

<SpeedControl
	disabled={disableX}
	speed={vector.x}
	{min}
	{max}
	{step}
	label={`${label} X`}
	resetTo={(max - min) / 2}
	onchange={() => onchange(vector)}
/>
<SpeedControl
	disabled={disableY}
	speed={vector.y}
	{min}
	{max}
	label={`${label} Y`}
	{step}
	onchange={() => onchange(vector)}
/>
<SpeedControl
	disabled={disableZ}
	speed={vector.z}
	{min}
	{max}
	label={`${label} Z`}
	{step}
	onchange={() => onchange(vector)}
/>
