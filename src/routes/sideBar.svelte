<script lang="ts">
	import Button, { Icon as ButtonIcon, Label as ButtonLabel } from '@smui/button';
	import Card, { Content as CardContent } from '@smui/card';
	import { type CircleDTO, type NgonDTO, FigureType, ReadableDto, type DTO } from '$lib';

	import CircleComponent from './settings/circleSettings.svelte';
	import NgonComponent from './settings/ngonSettings.svelte';
	import { figuresData } from '$lib/state';

	import GeneralSettingsComponent from './settings/generalSettings.svelte';

	function add_circle() {
		figuresData.update((fd) => {
			const newCircle: CircleDTO = <CircleDTO>{
				figureType: FigureType.Circle,
				size: 1.3,
				pointSpeed: 0,
				rotationSpeedX: 0,
				rotationSpeedY: 0,
				rotationSpeedZ: 0
			};
			const readableCircle: ReadableDto<DTO> = new ReadableDto(
				newCircle
			) as unknown as ReadableDto<DTO>;
			fd.push(readableCircle);
			return [...fd];
		});
	}

	function add_ngon() {
		figuresData.update((fd) => {
			const newNgon = <NgonDTO>{
				figureType: FigureType.NGon,
				numCorners: 4,
				size: 1.3,
				pointSpeed: 0,
				rotationSpeedX: 0,
				rotationSpeedY: 0,
				rotationSpeedZ: 0
			};
			const readableFigure: ReadableDto<DTO> = new ReadableDto(
				newNgon
			) as unknown as ReadableDto<DTO>;
			fd.push(readableFigure);
			return [...fd];
		});
	}

	function remove_figure(i: number) {
		figuresData.update((fd) => {
			fd.splice(i, 1);
			return [...fd];
		});
	}
</script>

<aside>
	<GeneralSettingsComponent />
	{#each $figuresData as figure, i}
		{#if figure.figureType == FigureType.Circle}
			<CircleComponent {i} {figure} {remove_figure}  />
		{/if}
		{#if figure.figureType == FigureType.NGon}
			<NgonComponent {i} {figure}  {remove_figure}  />
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
