<script lang="ts">
	import FormField from '@smui/form-field';
	import Card, {Content} from '@smui/card';
	import Slider from '@smui/slider';
	import Button, { Icon as ButtonIcon, Label as ButtonLabel } from '@smui/button';
	import { figuresData } from '$lib';
	import SpeedControl from './components/speedControl.svelte';
	import Vector3DControl from './components/vector3DControl.svelte';

	export let i: number;
	export let figure: any;
	export let remove_figure: (i: number) => void;
	export let reset: () => void;
	function update() {
		console.log('update');
		figuresData.update((fd) => {
			fd[i] = figure;
			return [...fd];
		});
		reset();
	}
</script>

<Card>
	<Content>
		<h3>Circle {i + 1}</h3>
		<SpeedControl
				speed={figure.radius}
				min={0.1}
				max={10}
				step={0.1}
				label={"Size"}
				resetTo={1}
				onchange={() => update()}/>
		<SpeedControl label="point speed" bind:speed={figure.pointSpeed} onchange={update} />
		<Vector3DControl label="rotation" bind:vector={figure.rotationSpeed} onchange={update} disableZ={true} />

		<FormField align="end" style="display: flex;">
			<Button on:click={() => remove_figure(i)}>
				<ButtonIcon class="material-icons">remove_circle</ButtonIcon>
				<ButtonLabel>Remove Circle</ButtonLabel>
			</Button>
		</FormField>
	</Content>
</Card>
