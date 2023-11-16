<script lang="ts">
	import Button, { Icon as ButtonIcon, Label as ButtonLabel } from '@smui/button';
	import Card, { Content as CardContent, ActionButtons } from '@smui/card';
	import { type CircleDTO, type NgonDTO, FigureType, type DTO } from '$lib';

	import { figuresData } from '$lib/state';

	import GeneralSettingsComponent from './settings/GeneralSettings.svelte';
	import FigureSettings from './settings/FigureSettings.svelte';

	function add_circle() {
		figuresData.addData(<CircleDTO>{
			figureType: FigureType.Circle,
			size: 1.3,
			pointSpeed: 0,
			rotationSpeedX: 0,
			rotationSpeedY: 0,
			rotationSpeedZ: 0
		});
	}

	figuresData.subscribe((value) => {
		console.log('figuresData changed: ', value);
	});

	function add_ngon() {
		figuresData.addData(<NgonDTO>{
			figureType: FigureType.NGon,
			numCorners: 4,
			size: 1.3,
			pointSpeed: 0,
			rotationSpeedX: 0,
			rotationSpeedY: 0,
			rotationSpeedZ: 0
		});
	}

</script>

<aside>
	<GeneralSettingsComponent />
	{#if $figuresData.length > 0}
		<FigureSettings data={$figuresData} i={0} />
	{/if}
	<Card>
		<CardContent>
			<ActionButtons>
				<Button on:click={() => add_circle()}>
					<ButtonIcon class="material-icons">add_circle</ButtonIcon>
					<ButtonLabel>Add Circle</ButtonLabel>
				</Button>
				<Button on:click={() => add_ngon()}>
					<ButtonIcon class="material-icons">add_circle</ButtonIcon>
					<ButtonLabel>Add NGon</ButtonLabel>
				</Button>
			</ActionButtons>
		</CardContent>
	</Card>
</aside>

<style lang="less">
	aside {
		background: transparent;
		width: 30em;
		padding: 1em;
		position: absolute;
	}
</style>
