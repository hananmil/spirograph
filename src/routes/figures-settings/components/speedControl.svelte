<script lang="ts">
	import FormField from '@smui/form-field';
	import Slider from '@smui/slider';
	import type * as THREE from 'three';
	import ButtonIcon from '@smui/icon-button';
	import Button from '@smui/button';
	export let min: number = -2;
	export let max: number = 2;
	export let step: number = 0.0025;
	export let resetTo: number = 0;
	export let unit: string = '';
	export let disabled: boolean = false;

	export let label: string = 'value';
	export let speed: number = 0;
	let speedSlider: Slider;
</script>

<FormField align="end" style="display: {disabled ? 'none' : 'flex'}">
	<span slot="label" class="label">
		{label}
		{speed.toFixed(3)}<small>{unit}</small>
	</span>
	<Slider style="flex-grow: 1;" bind:this={speedSlider} bind:value={speed} {min} {max} {step} />
	<ButtonIcon
		class="material-icons"
		size="mini"
		on:click={() => (speed = resetTo)}
		color="secondary"
	>
		<span class="material-symbols-outlined">
			<span class="material-symbols-outlined"> adjust </span>
		</span>
	</ButtonIcon>
</FormField>

<style lang="less">
	.label {
		padding-right: 12px;
		width: max-content;
		display: block;
		min-width: 8em;
	}
</style>
