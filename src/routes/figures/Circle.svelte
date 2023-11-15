<script lang="ts">
	import { stateStore, type CircleDTO, type ReadableDto } from '$lib';
	import { T } from '@threlte/core';
	import { onMount } from 'svelte';
	import type { Vector3Tuple } from 'three';

	export let dto: ReadableDto<CircleDTO>;

	let pointPosition: Vector3Tuple = getPointLocal(0);
    let objectRotation: Vector3Tuple = [0, 0, 0];

	stateStore.subscribe((value) => {
		pointPosition = getPointLocal(value.time);
        objectRotation = getRotation(value.time);
	});

    dto.subscribe((value) => {
        pointPosition = getPointLocal($stateStore.time);
        objectRotation = getRotation($stateStore.time);
    });

	function getPointLocal(time: number): THREE.Vector3Tuple {
		const result: Vector3Tuple = [
			$dto.size * Math.cos(time * $dto.pointSpeed),
			$dto.size * Math.sin(time * $dto.pointSpeed),
			0
		];
		return result;
	}

    function getRotation(time: number): THREE.Vector3Tuple {
        const result: Vector3Tuple = [
            time*$dto.rotationSpeedX,
            time*$dto.rotationSpeedY,
            time*$dto.rotationSpeedZ
        ];
        return result;
    }

	onMount(() => {
		console.log(dto);
	});
</script>

<T.Object3D rotation={objectRotation}>
	<T.Mesh>
		<T.TorusGeometry args={[$dto.size, $dto.size * 0.01, 10, 60]} />
		<T.MeshBasicMaterial color="white" />
	</T.Mesh>
	<T.Mesh position={pointPosition}>
		<T.SphereGeometry args={[$dto.size * 0.02]} />
		<T.MeshBasicMaterial color="red" />
	</T.Mesh>
</T.Object3D>
