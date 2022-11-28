import * as THREE from 'three';
import { Camera } from './camera';
import { AssetImporter } from './assetimporter';
import { models } from './assets.json'
import { Model } from './model';
import {remap} from './math'

type ModelKey = keyof typeof models;

export class Room 
{
    camera: Camera;
    assetImporter: AssetImporter;
    mainGroup: THREE.Object3D | undefined;
    id: ModelKey;
    normal: THREE.Vector3;

    constructor(id: ModelKey, assetImporter: AssetImporter, camera: Camera)
    {       
        this.camera = camera;
        this.assetImporter = assetImporter;
        this.id = id;
        this.mainGroup = undefined;

        let modelInfo = models[id] as Model;
        this.normal = new THREE.Vector3(modelInfo.normal.x, modelInfo.normal.y, modelInfo.normal.z);
    }

    public load()
    {
        this.assetImporter.loadModel(this.id, (grp) => this.onLoaded(grp));
    }

    private onLoaded(asset: THREE.Group)
    {
        this.mainGroup = asset;
    }

    public tick(dt: DOMHighResTimeStamp)
    {
        if(this.mainGroup !== undefined)
        {
            let object = this.mainGroup as THREE.Object3D;
            object.rotateY(dt*0.0003);

            let curNormal = this.normal.clone();
            curNormal.applyEuler(object.rotation);
            curNormal.multiplyScalar(-1);
            
            let cameraDir = this.camera.getDirection();
            let dotValue = cameraDir.dot(curNormal);

            if(dotValue > 0)
            {
                object.visible = true;
                //todo: dither object to fade out
            }
            else
            {
                object.visible = false;
            }
        }
    }
}