<script lang="ts">
	import { cameraFOV } from '$lib';
	import { T, type CurrentWritable } from '@threlte/core';
    import { useRender } from '@threlte/core'
	import { onMount } from 'svelte';
	import type { AmbientLight, Camera, DirectionalLight, PerspectiveCamera } from 'three';
    


    onMount(() => {
        console.log('onMount')
    })
</script>

<T.PerspectiveCamera
    makeDefault 
	near={0.1}
	far={1000}
	position={[5,0, 0]}
	lookAt={[0, 0, 0]}
/>

<T.DirectionalLight position={[-10, 10, -10]} intensity={0.5} />
<T.HemisphereLight position={[1, 1, 1]} intensity={0.6} />

<T.Mesh>
    <T.BoxGeometry args={[1, 1, 1]} />
    <T.MeshBasicMaterial color="red" />
</T.Mesh>