<script lang="ts">
  	import { stateStore, type NgonDTO, type ReadableDto } from '$lib';
	import { T } from '@threlte/core';
	import { onMount } from 'svelte';
	import { CatmullRomCurve3, Vector3, type Vector3Tuple } from 'three';

    export let dto: ReadableDto<NgonDTO>;
    let corners = cornersPosition($dto);
    let path = new CatmullRomCurve3(corners, true, 'catmullrom', 0.01);
    let objectRotation: Vector3Tuple = getRotation($dto,$stateStore.time);
    let pointPosition: Vector3Tuple = getLocalPoint($stateStore.time);
 
    stateStore.subscribe((value) => {
        pointPosition = getLocalPoint(value.time);
        objectRotation = getRotation($dto,value.time);
    });

    dto.subscribe((value) => {
        corners = cornersPosition(value);
        const pathPoints = [...corners, corners[0]];
        path = new CatmullRomCurve3(pathPoints, true, 'catmullrom', 0.2);
        const cornersStr = corners.map((c) => `\n\t(${c.x.toFixed(2)}, ${c.y.toFixed(2)}, ${c.z.toFixed(2)})`);
        console.log(`Corners: ${corners.length}: ${cornersStr}`);
        pointPosition = getLocalPoint($stateStore.time);
        objectRotation = getRotation(value,$stateStore.time);
    });

	function cornersPosition(dto:NgonDTO): Vector3[] {
		const points: Vector3[] = [];
		for (let i = 0; i < $dto.numCorners; i++) {
			const angle = (2 * Math.PI * i) / dto.numCorners;
			const x = dto.size * Math.cos(angle);
			const y = dto.size * Math.sin(angle);
			points.push(new Vector3(x, y, 0));
		}
		return points;
	}

    function getLocalPoint(time:number): Vector3Tuple {
		// Calculate the perimeter of the square
		const perimeter = $dto.numCorners * $dto.size;

		const speed = ($dto.pointSpeed * perimeter) / (2 * Math.PI);

		// Calculate the distance traveled
		let distanceTraveled = (speed * time) % perimeter;

		while (distanceTraveled < 0) {
			distanceTraveled += perimeter;
		}

		// Determine the side of the square the point is on
		const sideIndex = Math.floor(distanceTraveled / $dto.size);

		// Determine the position on that side
		const positionOnSide = distanceTraveled % $dto.size;
		const p1 = corners[sideIndex];
		const p2 = corners[(sideIndex + 1) % $dto.numCorners];

		// Determine the point coordinates
		const point = p2
			.sub(p1)
			.multiplyScalar(positionOnSide / $dto.size)
			.add(p1);

		// Return the new point
		return point.toArray();
	}

    function getRotation(dto:NgonDTO,time: number): THREE.Vector3Tuple {
        const result: Vector3Tuple = [
            time*dto.rotationSpeedX,
            time*dto.rotationSpeedY,
            time*dto.rotationSpeedZ
        ];
        return result;
    }
</script>

<T.Object3D rotation={objectRotation}>
	<T.Mesh>
		<T.TubeGeometry args={[path, 20*$dto.numCorners, 0.05, 12, true]} />
		<T.MeshStandardMaterial color="white" />
	</T.Mesh>
	<T.Mesh position={pointPosition}>
		<T.SphereGeometry args={[$dto.size * 0.2]} />
		<T.MeshStandardMaterial color="red" />
	</T.Mesh>
</T.Object3D>
