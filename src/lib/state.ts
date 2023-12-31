import { writable, type Readable, type Writable } from 'svelte/store';
import type { DTO } from "$lib";
import * as THREE from "three";
import { expoOut } from 'svelte/easing';

interface State {
    time:number;
    lastPoint: THREE.Vector3;
}
const defaultState:State = {
    time: 0,
    lastPoint: new THREE.Vector3(0,0,0)
}


function createStateStore(){
    const writableState = writable(defaultState);
    const readableState:Readable<State> = writableState;
    const {subscribe,update} = writableState;
    return {
        state: readableState,
        resetState: () => update(state => {
            state.lastPoint = new THREE.Vector3(0,0,0);
            state.time = 0;
            return state;
        }),
        updateTime: (timeFunc:(deltaT:number)=>number) => update(state => {
            state.time = timeFunc(state.time);
            return state;
        }),
        updateLastPoint: (updateFunc:(point:THREE.Vector3)=>THREE.Vector3) => update(state => {
            state.lastPoint = updateFunc(state.lastPoint);
            return state;
        }),
        subscribe
    }
}

function createFigureDataStore(){
    const writableData = writable<DTO[]>([]);
    const readableData:Readable<DTO[]> = writableData;
    const {subscribe,update,set} = writableData;
    return {
        readableData: readableData,
        resetData: () => set([]),
        addData: (newData:DTO) => update(data => {
            console.log("adding data",data,newData);
            return [...data,newData];
        }),
        remoevAtIndex: (index:number) => update(d => {
            d.splice(index,1);
            return d;
        }),
        subscribe
    }
}

export const figuresData = createFigureDataStore();

export const rotateCamera:Writable<boolean> = writable(true);
export const cameraFOV:Writable<number> = writable(50);
export const showFigures:Writable<boolean> = writable(true);
export const showDots:Writable<boolean> = writable(true);
export const isPaused:Writable<boolean> = writable(false);
export const stateStore = createStateStore();
export const stepsPerSecond: Writable<number> = writable(20);
