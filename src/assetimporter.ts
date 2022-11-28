import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { models } from './assets.json'
import { Scene } from './scene';

type ModelKey = keyof typeof models;
export interface LoadModelCallback {
    (group: THREE.Group): void;
}

export class AssetImporter 
{
    loader: GLTFLoader;
    scene: Scene;

    constructor(scene: Scene)
    {
        this.scene = scene;
        this.loader = new GLTFLoader();

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( 'public/libs/draco/' );
        this.loader.setDRACOLoader( dracoLoader );
    }

    public loadModel(modelID: ModelKey, callback?: LoadModelCallback)
    {
        let modelInfo = models[modelID];

        this.loader.load(modelInfo.path, (gltf) => this.onModelLoaded(gltf, callback), undefined, (error) => this.onModelFailed(error));
    }

    private onModelLoaded(gltf: GLTF, callback?: LoadModelCallback)
    {
        gltf.scene.traverse((obj) => {
            obj.receiveShadow = true;
        });
        this.scene.addObject( gltf.scene );

        if(callback)
            callback(gltf.scene);
    }

    private onModelFailed(error: ErrorEvent)
    {
        console.error( error );
    }
}
