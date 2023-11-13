import type { SceneComponent } from "./interfaces";

export abstract class SceneComponentBase<TItem extends THREE.Object3D> implements SceneComponent {
    protected items: TItem[];
    constructor() {
        this.items = [];
    }

    public addToScene(scene: THREE.Scene): void {
        for (const item of this.items) {
            scene.add(item);
        }
    }
    public removeFromScene(scene: THREE.Scene): void {
        for (const item of this.items) {
            scene.remove(item);
        }
    }
    public animate(): void { };

}
