<script lang="ts">

    import { T, useFrame } from '@threlte/core';
	import * as THREE from 'three'; 
    import {  Vector3 } from 'three';
	import { MeshLineGeometry, MeshLineMaterial } from '@threlte/extras';
	import { onMount } from 'svelte';

	export let axis: number;
	export let color: number;
	export let min: number = -100;
	export let max: number = 100;
	export let ticksDistance: number = 1;
	export let points: Vector3[] = [];

	points.push(new Vector3(0, 0, 0).setComponent(axis, min));
	points.push(new Vector3(0, 0, 0).setComponent(axis, max));

	let tickPositions: Vector3[][] = [];
	for (let i = min; i <= max; i += ticksDistance) {
		const tick = new Vector3(0, 0, 0).setComponent(axis, i);
		tickPositions.push([
			tick.clone().setComponent((axis+2)%3,  - 0.1),
			tick.clone().setComponent((axis+2)%3,  + 0.1)
		]);
        tickPositions.push([
			tick.clone().setComponent((axis+1)%3,  - 0.1),
			tick.clone().setComponent((axis+1)%3,  + 0.1)
		]);
	}
</script>
 <T.Mesh>
    <MeshLineGeometry points={points} shape={'custom'} shapeFunction={n=>0.01} />
    <MeshLineMaterial 
        {color} 
        side={THREE.DoubleSide}/>
</T.Mesh>

{#each tickPositions as offset}
	<T.Mesh>
		<MeshLineGeometry points={offset} shape={'custom'}  shapeFunction={n=>0.005}/>
		<MeshLineMaterial attach="material" depthTest={true} {color} side={THREE.DoubleSide}  />
	</T.Mesh>
{/each} 