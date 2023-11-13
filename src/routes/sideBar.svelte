<script lang="ts">
	import FormField from '@smui/form-field';
	import Button, { Icon as ButtonIcon, Label as ButtonLabel } from '@smui/button';
	import Checkbox from '@smui/checkbox';
	import Card, { Content as CardContent } from '@smui/card';
	import { type CircleDTO, type NgonDTO, FigureType, ReadableDto, type DTO } from '$lib';

	import CircleComponent from './figures-settings/circleComponent.svelte';
	import NgonComponent from './figures-settings/ngonComponent.svelte';
	import { figuresData, isPaused, showDots, showFigures } from '$lib/state';

	import GeneralSettingsComponent from './figures-settings/generalSettingsComponent.svelte';

	export let reset: () => void;

	function add_circle() {
		figuresData.update((fd) => {
			const newCircle: CircleDTO = <CircleDTO>{
				figureType: FigureType.Circle,
				radius: 1.3,
				pointSpeed: 0,
				rotationSpeedX: 0,
				rotationSpeedY: 0,
				rotationSpeedZ: 0
			};
			const readableCircle: ReadableDto<DTO, string> = new ReadableDto(
				newCircle
			) as unknown as ReadableDto<DTO, string>;
			fd.push(readableCircle);
			return [...fd];
		});
		reset();
	}

	function add_ngon() {
		figuresData.update((fd) => {
			const newNgon = <NgonDTO>{
				figureType: FigureType.Square,
				numSides: 4,
				radius: 1.3,
				pointSpeed: 0,
				rotationSpeedX: 0,
				rotationSpeedY: 0,
				rotationSpeedZ: 0
			};
			const readableFigure: ReadableDto<DTO, string> = new ReadableDto(
				newNgon
			) as unknown as ReadableDto<DTO, string>;
			fd.push(readableFigure);
			return [...fd];
		});
		reset();
	}

	function remove_figure(i: number) {
		figuresData.update((fd) => {
			fd.splice(i, 1);
			return [...fd];
		});
		reset();
	}
</script>

<aside>
	<GeneralSettingsComponent {reset} />
	{#each $figuresData as figure, i}
		{#if figure.figureType == FigureType.Circle}
			<CircleComponent {i} {figure} {remove_figure} {reset} />
		{/if}
		{#if figure.figureType == FigureType.Square}
			<NgonComponent {i} {figure} {remove_figure} {reset} />
		{/if}
	{/each}
	<Card>
		<CardContent>
			<Button on:click={() => add_circle()}>
				<ButtonIcon class="material-icons">add_circle</ButtonIcon>
				<ButtonLabel>Add Circle</ButtonLabel>
			</Button>
			<Button on:click={() => add_ngon()}>
				<ButtonIcon class="material-icons">add_circle</ButtonIcon>
				<ButtonLabel>Add NGon</ButtonLabel>
			</Button>
		</CardContent>
	</Card>
</aside>

<style lang="less">
	aside {
		width: 30em;
		padding: 1em;
	}
</style>
