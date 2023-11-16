<script lang="ts">
	import FormField from '@smui/form-field';
	import Card, { Content } from '@smui/card';
	import Button, { Icon as ButtonIcon, Label as ButtonLabel } from '@smui/button';
	import {  figuresData, type CircleDTO } from '$lib';
	import SpeedControl from './components/speedControl.svelte';
	import Vector3DControl from './components/vector3DControl.svelte';

	export let i: number;
	export let figure: CircleDTO;
</script>

<Card>
	<Content>
		<h3>Circle {i + 1}</h3>
		<SpeedControl
			bind:value={figure.size}
			min={0.1}
			max={10}
			step={0.1}
			label={'Size'}
			resetTo={1}
		/>
		<SpeedControl label="point speed" bind:value={figure.pointSpeed} />
		<Vector3DControl
			label="rotation"
			bind:x={figure.rotationSpeedX}
			bind:y={figure.rotationSpeedY}
			bind:z={figure.rotationSpeedZ}
			disableZ={true}
		/>

		<FormField align="end" style="display: flex;">
			<Button on:click={() => figuresData.remoevAtIndex(i)}>
				<ButtonIcon class="material-icons">remove_circle</ButtonIcon>
				<ButtonLabel>Remove Circle</ButtonLabel>
			</Button>
		</FormField>
	</Content>
</Card>
