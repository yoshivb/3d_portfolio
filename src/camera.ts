import * as THREE from 'three';
import { Scene } from './scene';

//Todo: calc this
const width = 25;
const height = 25;
const offsetY = 4;

export class Camera 
{
    scene: Scene;
    camera: THREE.OrthographicCamera;

    constructor(scene: Scene)
    {
        this.scene = scene;
        this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2 + offsetY, height / - 2 + offsetY);
        this.camera.position.x = 20.4606;
        this.camera.position.y = 18.736;
        this.camera.position.z = 19.2535;
        this.camera.lookAt( 0, 0, 0 );

        this.scene.addObject(this.camera);

        this.scene.directionalLight.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
    }

    public getDirection(): THREE.Vector3
    {
        var vector = new THREE.Vector3();
        this.camera.getWorldDirection(vector);
        return vector;
    }
}