<script lang="ts">
	import Paper, { Title, Subtitle, Content as PaperContent } from '@smui/paper';
	import { Point, type CircleDTO, type dto, type Figure, FiguresFactory, type NgonDTO, FigureType } from '$lib';
	import { onMount } from 'svelte';

	import SideBar from './sideBar.svelte';
	import { stateStore } from '$lib/state';

	let fixedCanvas: HTMLCanvasElement;
	let shapeCanvas: HTMLCanvasElement;
	let frameCanvas: HTMLCanvasElement;

    let figures: Figure[] = [];

    stateStore.subscribe((state) => {
        figures = state.figures;
    });
	function reset() {
        const shapeCtx = shapeCanvas.getContext('2d');
        if (!shapeCtx) throw new Error('No context');
		shapeCanvas.getContext('2d')?.reset();
		frameCanvas.getContext('2d')?.reset();
        figures = [];
        for (let i = 0; i < figuresData.length; i++) {
            figures.push(FiguresFactory.createFigure(figuresData[i]));
        }
        lastPoint = new Point(shapeCtx.canvas.width/2,shapeCtx.canvas.height/2);
        for (let i = 0; i < figures.length; i++) {
            let point = figures[i].getPoint(0);
            lastPoint = lastPoint.add(point);
        }
        deltaT = 0;
		initial_draw();
	}

	function move(deltaT: number) {
        if (paused) return;
        if (!shapeCanvas || !frameCanvas) 
            return;
        const shapeCtx = shapeCanvas.getContext('2d');
        const frameCtx = frameCanvas.getContext('2d');
        if (!shapeCtx || !frameCtx) throw new Error('No context');
        frameCtx.reset();
        frameCtx.font = '32px serif';
        frameCtx.strokeText("Time "+deltaT.toFixed(3), 40, 40);
        
        let location: Point = new Point(shapeCtx.canvas.width/2,shapeCtx.canvas.height/2);
        
        for (let i =0;i < figures.length; i++) {
            const figure = figures[i];
            if (showFigures) {
                figure.drawAt(frameCtx, location, deltaT);
            }
            const point = figure.getPoint(deltaT);
            location = location.add(point);
            if (showDots) {
                let ctx = frameCanvas.getContext('2d');
                if (!ctx) throw new Error('No context');
                ctx.beginPath();
                ctx.arc(location.x,location.y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = 'red';
                ctx.fill();
                ctx.closePath();
            }
        }
        let ctx = shapeCanvas.getContext('2d');
        if (!ctx) throw new Error('No context');
        const color = colorsCycler.next(0.1,deltaT).toRgbaString();
        ctx.strokeStyle = color.replace(';', '')
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(location.x, location.y);
        ctx.stroke();
        ctx.closePath();
        lastPoint = location;
	}


	function initial_draw() {
		const ctx = fixedCanvas.getContext('2d');
		if (!ctx) throw new Error('No context');
        ctx.reset();
		ctx.beginPath();
		ctx.moveTo(0, ctx.canvas.height / 2);
		ctx.lineTo(ctx.canvas.width, ctx.canvas.height / 2);
		ctx.stroke();
		ctx.moveTo(ctx.canvas.width/2, 0);
		ctx.lineTo(ctx.canvas.width/2, ctx.canvas.height);
		ctx.stroke();
		ctx.closePath();
	}
    

    function resize() {
        fixedCanvas.width = window.innerWidth - 300;
        fixedCanvas.height = window.innerHeight;
        shapeCanvas.width = window.innerWidth - 300;
        shapeCanvas.height = window.innerHeight ;
        frameCanvas.width = window.innerWidth - 300;
        frameCanvas.height = window.innerHeight;
        console.log(`resize ${window.innerWidth} ${window.innerHeight}`);
        reset();
    }

	onMount(() => {
		reset();
		const interval = setInterval(() => {
            if (paused) return;
			
            deltaT += speed;
            move(deltaT);
			if (deltaT > 3000) {
				clearInterval(interval);
			}
		}, 10);
        window.onresize = () => resize(); 
        resize();
        return () => {
			// clearInterval(interval);
		};
	});
</script>

<div class="drawer-container app-content">
    <Paper>
        <PaperContent>
            <SideBar />
        </PaperContent>
    </Paper>

    <main class="main-content">
        <canvas bind:this={fixedCanvas} />
        <canvas bind:this={shapeCanvas} />
        <canvas bind:this={frameCanvas} />
        <!-- <canvas bind:this={fixedCanvas}   />
        <canvas bind:this={shapeCanvas} />
        <canvas bind:this={frameCanvas} /> -->
    </main>
</div>

<style lang="less">
	.drawer-container {
		position: relative;
		display: flex;
		height: 100%;
		overflow: hidden;
		z-index: 0;
	}
    aside{
        width: 30em;
        padding: 1em;
    }
    main {
        position: relative;
        background-color: whitesmoke;
        width: 100%;
        height: 100%;
    }

    canvas {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    * :global(.mdc-card){
        margin-bottom: 1em;
        padding: 1em;
    }

	* :global(.app-content) {
		flex: auto;
		overflow: auto;
		position: relative;
		flex-grow: 1;
	}
</style>
