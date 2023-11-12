import { writable, type Readable, type Writable } from 'svelte/store';
import { Point,ZeroPoint, type dto } from "$lib";

interface State {
    time:number;
    lastPoint: Point;
}
const center = ZeroPoint;
const defaultState:State = {
    time: 0,
    lastPoint:center
}


function createStateStore(){
    const writableState = writable(defaultState);
    const readableState:Readable<State> = writableState;
    const {subscribe,update} = writableState;
    return {
        state: readableState,
        resetState: () => update(state => {
            state.lastPoint = new Point(0,0);
            state.time = 0;
            return state;
        }),
        updateTime: (timeFunc:(deltaT:number)=>number) => update(state => {
            state.time = timeFunc(state.time);
            return state;
        }),
        updateLastPoint: (updateFunc:(point:Point)=>Point) => update(state => {
            state.lastPoint = updateFunc(state.lastPoint);
            return state;
        }),
        subscribe
    }
}

export const showFigures:Writable<boolean> = writable(true);
export const showDots:Writable<boolean> = writable(true);
export const isPaused:Writable<boolean> = writable(false);
export const stateStore = createStateStore();
export const figuresData: Writable<dto[]> = writable([]);


