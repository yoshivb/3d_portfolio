import * as THREE from 'three';

export class Scene 
{
    scene: THREE.Scene;
    ambientLight: THREE.AmbientLight;
    directionalLight: THREE.DirectionalLight;

    constructor()
    {
        this.scene = new THREE.Scene();

        //init ambientlight
        this.ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
        this.scene.add( this.ambientLight  );

        //init directionallight
        this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
        this.directionalLight.castShadow = true; 
        this.scene.add( this.directionalLight );

        this.directionalLight.shadow.camera.left = -10;
        this.directionalLight.shadow.camera.bottom = -10;
        this.directionalLight.shadow.camera.top = 10;
        this.directionalLight.shadow.camera.right = 10;

        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.directionalLight.shadow.camera.near = 1; 
        this.directionalLight.shadow.camera.far = 100; 
        this.directionalLight.shadow.normalBias = 0.03;
    }

    public addObject(object: THREE.Object3D)
    {
        this.scene.add(object);
    }
}