import { DirectionalLight, HemisphereLight } from "three";
import { SceneComponentBase } from "./sceneComponentBase";

export class SimLights extends SceneComponentBase<THREE.Light>{
    private _directionalLight: DirectionalLight;
    private _hemisphereLight: HemisphereLight;

    constructor(){
        super();
        this._directionalLight = new DirectionalLight(0x9090aa);
        this._directionalLight.position.set(-10, 10, -10).normalize();

        this._hemisphereLight = new HemisphereLight(0xffffff, 0x444444);
        this._hemisphereLight.position.set(1, 1, 1);
        this._hemisphereLight.intensity = 6;
        
        this.items.push(this._directionalLight);
        this.items.push(this._hemisphereLight);
    }
    
}