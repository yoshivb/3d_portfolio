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
        this.ambientLight = new THREE.AmbientLight( 0x555555 );
        this.scene.add( this.ambientLight  );

        //init directionallight
        this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
        this.directionalLight.castShadow = true; 
        this.scene.add( this.directionalLight );

        //Todo: needs calcing
        this.directionalLight.shadow.camera.left = -25;
        this.directionalLight.shadow.camera.bottom = -25;
        this.directionalLight.shadow.camera.top = 25;
        this.directionalLight.shadow.camera.right = 25;

        this.directionalLight.shadow.mapSize.width = 1024;
        this.directionalLight.shadow.mapSize.height = 1024;
        this.directionalLight.shadow.camera.near = 1; 
        this.directionalLight.shadow.camera.far = 100; 
        this.directionalLight.shadow.normalBias = 0.1;
    }

    public addObject(object: THREE.Object3D)
    {
        this.scene.add(object);
    }
}