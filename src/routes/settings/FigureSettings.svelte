<script lang="ts">
	import {
		FigureType,
		type DTO,
		type CircleDTO,
		type NgonDTO
	} from '$lib';
	import type { Vector3 } from 'three';
	import CircleSettings from './CircleSettings.svelte';
	import NgonSettings from './NgonSettings.svelte';
	export let data: DTO[] = [];
	export let i: number = 0;

	function toCircleData(dto: any): CircleDTO | null {
		const temp = dto as DTO;
		if (temp.figureType !== FigureType.Circle) {
			return null;
		}
		return dto as CircleDTO;
	}

	function toNgonData(dto: any): NgonDTO | null {
		let temp = dto as DTO;
		if (temp.figureType !== FigureType.NGon) {
			return null;
		}
		return dto as NgonDTO;
	}
</script>

{#if data?.length > 0}

	{@const circleDTO = toCircleData(data[0])}
	{@const ngonDTO = toNgonData(data[0])}
	{#if circleDTO}
		<CircleSettings figure={circleDTO} {i} />
	{/if}

	{#if ngonDTO}
		<NgonSettings figure={ngonDTO} {i} />
	{/if}

	{#if data.length > 1}
		<svelte:self data={data.slice(1)} i={i+1} />
	{/if}
{/if}
