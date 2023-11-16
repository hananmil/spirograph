<script lang="ts">
	import { cameraFOV, figuresData, stateStore } from '$lib';
	import { T } from '@threlte/core';
	import Axis from './Axis.svelte';
	import { Grid, OrbitControls, Sky } from '@threlte/extras';
	import { get } from 'svelte/store';
	import Figure from './figures/Figure.svelte';
</script>

<T.PerspectiveCamera
	makeDefault
	fov={$cameraFOV}
	aspect={window.innerWidth / window.innerHeight}
	near={0.01}
	far={1000}
	position={[3, 4, 15]}
	on:create={({ ref }) => {
		ref.lookAt(0, 0, 0);
	}}
>
	<OrbitControls />
</T.PerspectiveCamera>

<T.DirectionalLight position={[-10, 10, -10]} intensity={0.5} />
<T.DirectionalLight position={[10, 10, 10]} intensity={0.5}/>
<T.HemisphereLight position={[1, 1, 1]} intensity={0.6} />

<Sky elevation={$stateStore.time/20} />

<Axis axis={0} color={0xffffff00} />
<Axis axis={1} color={0xff00ff00} />
<Axis axis={2} color={0xff00ffff} />

<Grid
	infiniteGrid={true}
	cellColor={'#46536b'}
	sectionColor={'#1f2937'}
	sectionThickness={1}
	backgroundColor={'#4f5742'}
	backgroundOpacity={1}
	fadeOut={false}
	position={[0, -8, 0]}
/>
<Figure data={$figuresData} />