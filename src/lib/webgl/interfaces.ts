export interface SceneComponent {
    addToScene(scene: THREE.Scene): void;
    removeFromScene(scene: THREE.Scene): void;
    animate(): void;
}


