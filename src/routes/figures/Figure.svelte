<script lang="ts">
	import { type DTO, FigureType, type CircleDTO, type NgonDTO, figuresData } from '$lib';
	import type { Vector3Tuple } from 'three';
	import Circle from './Circle.svelte';
	import NGon from './NGon.svelte';
    import {writable,type Writable} from 'svelte/store';

    export let i:number = 0;
	export let data: DTO[];
    export let position: Vector3Tuple = [0, 0, 0];
    export let pointPosition: Writable<Vector3Tuple> = writable([0, 0, 0]);

    if(!data){
        data = $figuresData;
    }

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
		<Circle dto={circleDTO} {position} bind:pointPosition={pointPosition}/>
	{/if}

	{#if ngonDTO}
		<NGon dto={ngonDTO} {position} bind:pointPosition={pointPosition}/>
	{/if}

	{#if data.length > 1}
		<svelte:self data={data.slice(1)} position={$pointPosition} i={i+1}/>
	{/if}
{/if}