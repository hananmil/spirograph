<script lang="ts">
	import FormField from '@smui/form-field';
	import Content from '@smui/card';
	import { figuresData } from '$lib';
	import Button, { Icon as ButtonIcon, Label as ButtonLabel } from '@smui/button';
	import SpeedControl from './components/speedControl.svelte';
	import Slider from '@smui/slider';
	import Vector3DControl from './components/vector3DControl.svelte';
	import Card from '@smui/card';
	export let i: number;
	export let figure: any;
	export let remove_figure: (i: number) => void;
	export let reset: () => void;
	function update() {
		figuresData.update((fd) => {
			fd[i] = figure;
			return [...fd];
		});
		reset();
	}
</script>

<Card>
	<Content>
		<h3>NGon</h3>
		<FormField align="end" style="display: flex;">
			<Slider
				type="range"
				style="flex-grow: 1;"
				bind:value={figure.numSides}
				min={2}
				max={20}
				on:change={() => update()}
			/>
			<span slot="label" style="padding-right: 12px; width: max-content; display: block;">
				Point count {figure.numSides}
			</span>
		</FormField>
		<FormField align="end" style="display: flex;">
			<Slider
				type="range"
				style="flex-grow: 1;"
				bind:value={figure.radius}
				min={0.1}
				max={10}
				step="0.1"
				on:change={() => update()}
			/>
			<span slot="label" style="padding-right: 12px; width: max-content; display: block;">
				Radius {figure.radius}
			</span>
		</FormField>
		<SpeedControl label="Point speed" bind:speed={figure.pointSpeed} onchange={update} />
		<Vector3DControl label="Rotation speed" bind:vector={figure.rotationSpeed} onchange={update} />

		<FormField align="end" style="display: flex;">
			<Button on:click={() => remove_figure(i)}>
				<ButtonIcon class="material-icons">remove_circle</ButtonIcon>
				<ButtonLabel>Remove Square</ButtonLabel>
			</Button>
		</FormField>
	</Content>
</Card>
