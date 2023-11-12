import {
  BoxGeometry,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three';


export class SceneBuilder{
    private scene:Scene;
    private camera:PerspectiveCamera;
    private renderer:WebGLRenderer|null = null;
    private cube:Mesh;
    constructor(){
        const scene = new Scene();
        const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        this.camera = camera;

        const geometry = new BoxGeometry();
        
        const material = new MeshStandardMaterial({
            color: 0x00ff00,
            metalness: 0.13
        });
        
        const cube = new Mesh(geometry, material);
        this.cube = cube;
        scene.add(cube);
        
        const directionalLight = new DirectionalLight(0x9090aa);
        directionalLight.position.set(-10, 10, -10).normalize();
        scene.add(directionalLight);
        
        const hemisphereLight = new HemisphereLight(0xffffff, 0x444444);
        hemisphereLight.position.set(1, 1, 1);
        scene.add(hemisphereLight);
        this.scene = scene;


    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        this.renderer?.render(this.scene, this.camera);
    }
        
    resize() {
            this.renderer?.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        };

    public createScene(el:HTMLCanvasElement){
        this.renderer = new WebGLRenderer({ antialias: true, canvas: el });
        this.resize();
        this.animate();
        window.addEventListener('resize', this.resize);
    }
}
