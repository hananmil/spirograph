import { writable, type Readable, type Writable } from 'svelte/store';
import { Point, type dto } from "$lib";

interface State {
    time:number;
    lastPoint: Point;
}


function createStateStore(){
    let writableState = writable({time:0,lastPoint:new Point(0,0)});
    let readableState:Readable<State> = writableState;
    let {subscribe,update,set} = writableState;
    return {
        state: readableState,
        resetState: () => update(state => {
            state.lastPoint = new Point(0,0);
            state.time = 0;
            return state;
        }),
        updateTime: (timefunc:(deltaT:number)=>number) => update(state => {
            state.time = timefunc(state.time);
            return state;
        }),
        setLastPoint: (point:Point) => update(state => {
            state.lastPoint = point;
            return state;
        }),
        subscribe
    }
}

export let showFigures:Writable<boolean> = writable(true);
export let showDots:Writable<boolean> = writable(true);
export let isPaused:Writable<boolean> = writable(false);
export const stateStore = createStateStore();
export const figuresData: Writable<dto[]> = writable([]);


