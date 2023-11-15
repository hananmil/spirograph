<script lang="ts">
  	import { stateStore, type NgonDTO, type ReadableDto } from '$lib';
	import { T } from '@threlte/core';
	import { onDestroy, onMount } from 'svelte';
	import { CatmullRomCurve3, TubeGeometry, Vector3, type Vector3Tuple } from 'three';

    export let dto: ReadableDto<NgonDTO>;
    let corners = cornersPosition($dto.numCorners,$dto.size);
    
    let path = new CatmullRomCurve3(corners, true, 'catmullrom', 0.01);
    

    let geometry:TubeGeometry = new TubeGeometry(path, 20*$dto.numCorners, 0.01*$dto.size, 12, true); 
    let objectRotation: Vector3Tuple = getRotation($dto,$stateStore.time);
    let pointPosition: Vector3Tuple = getLocalPoint($stateStore.time,$dto.numCorners,$dto.size,$dto.pointSpeed);
 
    const stateStoreUnsub = stateStore.subscribe((value) => {
        pointPosition = getLocalPoint(value.time,$dto.numCorners,$dto.size,$dto.pointSpeed);
        objectRotation = getRotation($dto,value.time);

    });

    const dtoUnsub = dto.subscribe((value) => {
        corners = cornersPosition(value.numCorners,value.size);
		path = new CatmullRomCurve3(corners, true, 'catmullrom', 0.01);
		geometry = new TubeGeometry(path, 20 * value.numCorners, 0.01*value.size, 12, true);
        pointPosition = getLocalPoint($stateStore.time,value.numCorners,value.size,value.pointSpeed);
        objectRotation = getRotation(value,$stateStore.time);
    });

    onDestroy(() => {
        stateStoreUnsub();
        dtoUnsub();
        geometry.dispose();
    });

	function cornersPosition(numCorners:number,size:number): Vector3[] {
		const points: Vector3[] = [];
		for (let i = 0; i < $dto.numCorners; i++) {
			const angle = (2 * Math.PI * i) / numCorners;
			const x = size * Math.cos(angle);
			const y = size * Math.sin(angle);
			points.push(new Vector3(x, y, 0));
		}
		return points;
	}

    function getLocalPoint(time:number,numCorners:number,size:number,pointSpeed:number): Vector3Tuple {
		// Calculate the perimeter of the square
		const perimeter = numCorners * size;

		const speed = (pointSpeed * perimeter) / (2 * Math.PI);

		// Calculate the distance traveled
		let distanceTraveled = (speed * time) % perimeter;

		while (distanceTraveled < 0) {
			distanceTraveled += perimeter;
		}

		// Determine the side of the square the point is on
		const sideIndex = Math.floor(distanceTraveled / size);

		// Determine the position on that side
		const positionOnSide = distanceTraveled % size;
		const p1 = corners[sideIndex];
		const p2 = corners[(sideIndex + 1) % numCorners];

		// Determine the point coordinates
		const point = p2.clone()
			.sub(p1)
			.multiplyScalar(positionOnSide / size)
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
	<T.Mesh args={[geometry]}>
		<T.MeshStandardMaterial color="white" />
	</T.Mesh>
	<T.Mesh position={pointPosition}>
		<T.SphereGeometry args={[$dto.size * 0.02]} />
		<T.MeshStandardMaterial color="red" />
	</T.Mesh>
</T.Object3D>
