<script lang="ts">
	import FormField from '@smui/form-field';
	import Slider from '@smui/slider';
	import Textfield, { Input } from '@smui/textfield';

	import ButtonIcon from '@smui/icon-button';
	export let min: number = -2;
	export let max: number = 2;
	export let step: number = 0.0025;
	export let resetTo: number = 0;
	export let unit: string = '';
	export let disabled: boolean = false;

	export let label: string = 'value';
	export let value: number = 0;
	let speedSlider: Slider;
	let input1: Input;
</script>

<FormField align="end" style="display: {disabled ? 'none' : 'flex'}">
	<span class="label">{label}</span>	
	<Input bind:value
		bind:this={input1}
		placeholder="Search"
		min={min}
		max={max}
		step={step}
		class="solo-input"
		type="number"
		/>
	<small>{unit}</small>
	<Slider style="flex-grow: 1;" bind:this={speedSlider} bind:value={value} {min} {max} {step} />
	<ButtonIcon
		class="material-icons"
		size="mini"
		on:click={() => (value = resetTo)}
		color="secondary"
	>
		<span class="material-symbols-outlined">
			<span class="material-symbols-outlined"> adjust </span>
		</span>
	</ButtonIcon>
</FormField>

<style lang="less">
	.label {
		// padding-right: 12px;
		width: fit-content;
		display: flex;
		min-width: 9em;
	}

	:global(input.solo-input) {
		flex-grow: 0;
		width: 4em;
		border-bottom: 1px solid rgba(0, 0, 0, 0.42);
	}
</style>
