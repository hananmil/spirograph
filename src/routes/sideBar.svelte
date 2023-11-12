<script lang="ts">
	import FormField from '@smui/form-field';
	import Paper, { Title, Subtitle, Content as PaperContent } from '@smui/paper';
	import Button, { Icon as ButtonIcon, Label as ButtonLabel } from '@smui/button';
	import Checkbox from '@smui/checkbox';
	import Card, { Content as CardContent } from '@smui/card';
	import {
		Point,
		type CircleDTO,
		type dto,
		type Figure,
		FiguresFactory,
		type NgonDTO,
		FigureType
	} from '$lib';
	import { onMount } from 'svelte';

	import CircleComponent from './figures-settings/circleComponent.svelte';
	import NgonComponent from './figures-settings/ngonComponent.svelte';
	import { figuresData, isPaused, showDots, showFigures, stateStore } from '$lib/state';

	function add_circle() {
		figuresData.update((fd) => {
			fd.push(<CircleDTO>{
				figureType: FigureType.Circle,
				radius: 100,
				pointSpeed: 0
			});
			return [...fd];
		});
	}

	function add_ngon() {
		figuresData.update((fd) => {
			fd.push(<NgonDTO>{
				figureType: FigureType.Square,
				numSides: 2,
				radius: 100,
				pointSpeed: 0,
				rotationSpeed: 0
			});
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
	<Card>
		<CardContent>
			<h3>Settings</h3>
			<FormField style="display: flex;">
				<Checkbox bind:checked={$showFigures} />
				<span slot="label"> Show figures </span>
			</FormField>
			<FormField style="display: flex;">
				<Checkbox bind:checked={$showDots} />
				<span slot="label"> Show figure dots </span>
			</FormField>
			<FormField style="display: flex;">
				<Checkbox bind:checked={$isPaused} />
				<span slot="label">
					Pause {$isPaused ? '▶' : '⏸'}
				</span>
			</FormField>
			<FormField align="end" style="display: flex;">
				<Button on:click={() => stateStore.resetState()}>
					<ButtonIcon class="material-icons">refresh</ButtonIcon>
					<ButtonLabel>Reset time</ButtonLabel>
				</Button>
			</FormField>
		</CardContent>
	</Card>
	{#each $figuresData as figure, i}
		<Card>
			{#if figure.figureType == FigureType.Circle}
				<CircleComponent {i} {figure} {remove_figure} reset={stateStore.resetState} />
			{/if}
			{#if figure.figureType == FigureType.Square}
				<NgonComponent {i} {figure} {remove_figure} reset={stateStore.resetState} />
			{/if}
		</Card>
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
