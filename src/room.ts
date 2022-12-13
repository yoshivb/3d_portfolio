import * as THREE from 'three';
import { Camera } from './camera';
import { AssetImporter } from './assetimporter';
import { models } from './assets.json'
import { Model } from './model';
import { MainMaterial } from './mainmaterial';
import { Clickable } from './clickable';

type ModelKey = keyof typeof models;

export class Room 
{
    camera: Camera;
    assetImporter: AssetImporter;
    mainGroup: THREE.Object3D | undefined;
    id: ModelKey;

    clickables: Clickable[];
    normal: THREE.Vector3;

    constructor(id: ModelKey, assetImporter: AssetImporter, camera: Camera)
    {       
        this.camera = camera;
        this.assetImporter = assetImporter;
        this.id = id;
        this.mainGroup = undefined;
        this.clickables = [];

        let modelInfo = models[id] as Model;
        this.normal = new THREE.Vector3(modelInfo.normal.x, modelInfo.normal.y, modelInfo.normal.z);
    }

    public load()
    {
        this.assetImporter.loadModel(this.id, (grp) => this.onLoaded(grp));
    }

    private getMaterial(curMaterial: THREE.Material): THREE.ShaderMaterial
    {
        return new MainMaterial(curMaterial);
    }

    private onLoaded(asset: THREE.Group)
    {
        this.mainGroup = asset;

        if(this.id != "floor")
        {
            let modelInfo = models[this.id] as Model;

            let clickableMeshes: THREE.Mesh[] = [];

            this.mainGroup.traverse((obj) =>
            {
                let mesh = obj as THREE.Mesh;
                if(mesh && mesh.isMesh)
                {
                    let foundClickable = modelInfo.clickables.find((obj) => obj.name == mesh.name);

                    if(foundClickable != undefined)
                    {
                        clickableMeshes.push(mesh);
                    }

                    if(Array.isArray(mesh.material))
                    {
                        for(let i = 0; i < mesh.material.length; i++)
                        {
                            mesh.material[i] = this.getMaterial(mesh.material[i]);
                        }
                    }
                    else
                    {
                        mesh.material = this.getMaterial(mesh.material);
                    }
                }
            });

            for(let mesh of clickableMeshes)
            {
                let foundClickable = modelInfo.clickables.find((obj) => obj.name == mesh.name);
                if(foundClickable)
                    this.clickables.push(new Clickable(foundClickable, mesh));
            }
        }
    }

    public tick(dt: DOMHighResTimeStamp)
    {
        if(this.mainGroup !== undefined)
        {
            let object = this.mainGroup as THREE.Object3D;

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

    public setRotation(rotation: number)
    {
        if(this.mainGroup !== undefined)
        {
            let object = this.mainGroup as THREE.Object3D;
            object.rotation.y = rotation;
        }
    }
}