<script lang="ts">
	import FormField from '@smui/form-field';
	import Paper, { Title, Subtitle, Content as PaperContent } from '@smui/paper';
	import Button, { Icon as ButtonIcon, Label as ButtonLabel } from '@smui/button';
    import Checkbox from '@smui/checkbox';
	import Card, { Content as CardContent } from '@smui/card';
	import { Point, type CircleDTO, type dto, type Figure, FiguresFactory, type NgonDTO, FigureType } from '$lib';
	import { onMount } from 'svelte';

    import CircleComponent from './figures-settings/circleComponent.svelte';
    import NgonComponent from './figures-settings/ngonComponent.svelte';
    import { ColorsCycler } from '$lib';

    const colorsCycler = new ColorsCycler(['rgba(255,0,0,1)', 'rgba(0,255,0,0)', 'rgba(0,0,255,1)']);
	let fixedCanvas: HTMLCanvasElement;
	let shapeCanvas: HTMLCanvasElement;
	let frameCanvas: HTMLCanvasElement;
	let deltaT = 0;
	let figuresData: dto[] = [];
    let figures: Figure[] = [];
    let lastPoint: Point = new Point(0,0);

    let showFigures = true;
    let showDots = true;
    let speed = 0.1;
    let paused  = false;



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

	function add_circle() {
		figuresData.push(<CircleDTO>{
			figureType: FigureType.Circle,
            radius: 100,
			pointSpeed: 0
		});
		figuresData = [...figuresData];
		reset();
	}

    function add_ngon() {
        figuresData.push(<NgonDTO>{
            figureType: FigureType.Square,
            numSides: 2,
            radius: 100,
            pointSpeed: 0,
            rotationSpeed: 0
        });
        figuresData = [...figuresData];
        reset();
    }

    function remove_figure(i:number) {
        figuresData.splice(i, 1);
        figuresData = [...figuresData];
        reset();
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
            <aside>
                <Card>
                    <CardContent>
                        <h3>Settings</h3>
                        <FormField style="display: flex;">
                            <Checkbox bind:checked={showFigures} />
                            <span slot="label">
                                Show circles
                            </span>
                        </FormField>
                        <FormField style="display: flex;">
                            <Checkbox bind:checked={showDots} />
                            <span slot="label">
                                Show circle dot
                            </span>
                        </FormField>
                        <FormField style="display: flex;">
                            <Checkbox bind:checked={paused} />
                            <span slot="label">
                                Paused {paused}
                            </span>
                        </FormField>
                        <FormField style="display: flex">
                            <input
                                type="range"
                                style="flex-grow: 1;"
                                bind:value={speed}
                                min={0}
                                max={2}
                                step="0.1"/>
                            <span slot="label" style="padding-right: 12px; width: max-content; display: block;">
                                Speed {speed}
                            </span>
                        </FormField>
                        <FormField align="end" style="display: flex;">
                            <Button on:click={() => reset()}>
                                <ButtonIcon class="material-icons">refresh</ButtonIcon>
                                <ButtonLabel>Reset</ButtonLabel>
                            </Button>
                        </FormField>
                    </CardContent>
                </Card>
                {#each figuresData as figure,i}
                    <Card>
                        {#if (figure.figureType == FigureType.Circle) }
                            <CircleComponent i={i} figure={figure} remove_figure={remove_figure} reset={reset}/>
                        {/if}
                        {#if (figure.figureType == FigureType.Square) }
                            <NgonComponent i={i} figure={figure} remove_figure={remove_figure} reset={reset}/>
                        {/if}
                    </Card>
                {/each}
                <Card>
                    <CardContent>
                        <Button on:click={() => add_circle()}>
                            <ButtonIcon class="material-icons">add_circle</ButtonIcon>
                            <ButtonLabel>Add Circle</ButtonLabel>
                        </Button>
                        <Button on:click={() => add_ngon()}>
                            <ButtonIcon class="material-icons">add_circle</ButtonIcon>
                            <ButtonLabel>Add NGon</ButtonLabel>
                        </Button>
                    </CardContent>
                </Card>
            </aside>
        
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
