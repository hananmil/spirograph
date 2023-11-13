<script lang="ts">
	import FormField from '@smui/form-field';
	import Content from '@smui/card';
	import Button, { Icon as ButtonIcon, Label as ButtonLabel } from '@smui/button';
	import SpeedControl from './components/speedControl.svelte';
	import Vector3DControl from './components/vector3DControl.svelte';
	import Card from '@smui/card';
	import type { NgonDTO } from '$lib';
	export let i: number;
	export let figure: any;
	export let remove_figure: (i: number) => void;
</script>

<Card>
	<Content>
		<h3>NGon</h3>
		<SpeedControl label="Size" bind:value={figure.numSides} min={2} max={20} step={1} resetTo={4} />
		<SpeedControl label="Size" bind:value={figure.radius} min={0.1} max={10} step={0.1} resetTo={1}/>
		<SpeedControl label="Point speed" bind:value={figure.pointSpeed}  />
		<Vector3DControl
			label="Rotation"
			bind:x={figure.rotationSpeedX}
			bind:y={figure.rotationSpeedY}
			bind:z={figure.rotationSpeedZ}
		/>

		<FormField align="end" style="display: flex;">
			<Button on:click={() => remove_figure(i)}>
				<ButtonIcon class="material-icons">remove_circle</ButtonIcon>
				<ButtonLabel>Remove Square</ButtonLabel>
			</Button>
		</FormField>
	</Content>
</Card>
