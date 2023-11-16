<script lang="ts">
	import { stateStore, type CircleDTO } from '$lib';
	import { T } from '@threlte/core';
	import { beforeUpdate, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { Vector3, type Mesh, type Vector3Tuple } from 'three';

	export let dto: CircleDTO;
	export let position: Vector3Tuple;
    export let pointPosition: Writable<Vector3Tuple>;
	let localPointPosition: Vector3Tuple = [0, 0, 0];

	let objectRotation: Vector3Tuple = [0, 0, 0];
	let pointMesh: Mesh;
	let size :number = 1;

	// stateStore.subscribe((value) => {
	// 	if (!pointPosition || !pointMesh) {
	// 		return;
	// 	}
	// 	if (dto.size !== size) {
	// 		size = dto.size;
	// 	}
	// 	localPointPosition = getPointLocal(value.time);
	// 	pointPosition.set(getPointGlobal(value.time));
	// 	objectRotation = getRotation(value.time);
	// });

	function getPointGlobal(time: number): THREE.Vector3Tuple {
		const result =  pointMesh.localToWorld(new Vector3(0,0,0)).toArray();
		return result;
	}

	function getPointLocal(time: number): THREE.Vector3Tuple {
		const result: Vector3Tuple = [
			dto.size * Math.cos(time * dto.pointSpeed),
			dto.size * Math.sin(time * dto.pointSpeed),
			0
		];
		return result;
	}

	function getRotation(time: number): THREE.Vector3Tuple {
		const result: Vector3Tuple = [
			time * dto.rotationSpeedX,
			time * dto.rotationSpeedY,
			time * dto.rotationSpeedZ
		];
		return result;
	}
	onMount(() => {
		localPointPosition = getPointLocal($stateStore.time);
		$pointPosition = (getPointGlobal($stateStore.time));
		objectRotation = getRotation($stateStore.time);
		if (dto.size !== size) {
			size = dto.size;
		}
		console.log(`Circle mounted. position: ${position} globalPointPosition: ${$pointPosition} localPointPosition: ${localPointPosition}`);
	});
	beforeUpdate(() => {
		if (dto.size !== size) {
			size = dto.size;
		}
		localPointPosition = getPointLocal($stateStore.time);
		objectRotation = getRotation($stateStore.time);
		if (!pointPosition || !pointMesh) {
			return;
		}
		$pointPosition = (getPointGlobal($stateStore.time));
	});
</script>
<T.Object3D bind:rotation={objectRotation} bind:position={position}>
	<T.Mesh>
		<T.TorusGeometry args={[size, size * 0.01, 10, 60]} />
		<T.MeshBasicMaterial color="white" />
	</T.Mesh>
	<T.Mesh position={localPointPosition} bind:ref={pointMesh}>
		<T.SphereGeometry args={[size * 0.02]} />
		<T.MeshBasicMaterial color="red" />
	</T.Mesh>
</T.Object3D>
