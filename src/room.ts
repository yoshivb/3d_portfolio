import * as THREE from 'three';
import { Camera } from './camera';
import { AssetImporter } from './assetimporter';
import { models } from './assets.json'
import { Model } from './model';
import { MainMaterial } from './mainmaterial';
import { Clickable } from './clickable';
import { FocusManager } from './focusmanager';

type ModelKey = keyof typeof models;

export class Room 
{
    camera: Camera;
    assetImporter: AssetImporter;
    mainGroup: THREE.Object3D | undefined;
    id: ModelKey;

    clickables: Clickable[];
    normal: THREE.Vector3;

    isVisible: boolean = true;
    alwaysVisible: boolean = false;

    focusManager: FocusManager|null;

    constructor(id: ModelKey, assetImporter: AssetImporter, camera: Camera)
    {       
        this.camera = camera;
        this.assetImporter = assetImporter;
        this.id = id;
        this.mainGroup = undefined;
        this.clickables = [];
        this.focusManager = null;

        let modelInfo = models[id] as Model;
        this.normal = new THREE.Vector3(modelInfo.normal.x, modelInfo.normal.y, modelInfo.normal.z);
        if(modelInfo.alwaysVisible)
        {
            this.alwaysVisible = true;
        }
    }

    public setFocusManager(focusManager: FocusManager)
    {
        this.focusManager = focusManager;
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

            let clickableObjects: THREE.Object3D[] = [];

            this.mainGroup.traverse((obj) =>
            {
                let foundClickable = modelInfo.clickables.find((clickable) => obj.name == clickable.name);

                if(foundClickable != undefined)
                {
                    clickableObjects.push(obj);
                }

                let mesh = obj as THREE.Mesh;
                if(mesh && mesh.isMesh)
                {
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

            for(let object of clickableObjects)
            {
                let foundClickable = modelInfo.clickables.find((clickable) => clickable.name == object.name);
                if(foundClickable)
                {
                    let clickable = new Clickable(foundClickable, object);
                    clickable.addEventListener("onclick", () => this.onClickClickable(clickable));
                    this.clickables.push(clickable);
                }
            }
        }
    }

    public tick(dt: DOMHighResTimeStamp)
    {
        if(this.mainGroup !== undefined)
        {
            let object = this.mainGroup;

            if(this.alwaysVisible)
            {
                this.isVisible = true;
            }
            else
            {
                if(this.camera.hasTarget() && !this.camera.isInTransition())
                {
                    this.isVisible = this.camera.currentTarget == this;
                }
                else
                {
                    let curNormal = this.normal.clone();
                    curNormal.applyEuler(object.rotation);
                    curNormal.multiplyScalar(-1);
                    
                    let cameraDir = this.camera.getDirection();
                    let dotValue = cameraDir.dot(curNormal);
                    
                    let threshold = this.camera.isInTransition() ? 0.2 : 0;
                    
                    if(dotValue > threshold)
                    {
                        this.isVisible = true;
                    }
                    else
                    {
                        this.isVisible = false;
                    }
                }
            }
            object.visible = this.isVisible;

            for(let clickable of this.clickables)
            {
                clickable.tick(dt);
            }
        }
    }

    public setRotation(rotation: number)
    {
        if(this.mainGroup !== undefined)
        {
            this.mainGroup.rotation.y = rotation;
        }
    }

    public getOffsetRotation(): number
    {
        if(this.mainGroup !== undefined)
        {
            let offset = Math.atan2(this.normal.z, this.normal.x);
            return offset;
        }
        return 0;
    }

    private onClickClickable(clickable: Clickable)
    {
        if(this.focusManager == null) return;

        if(this.focusManager.focusedObject == null)
        {
            this.focusManager.focus(this);
        }
        else if (this.focusManager.focusedObject == this)
        {
            this.focusManager.focus(clickable);
        }
        else if (this.focusManager.focusedObject instanceof Clickable)
        {
            this.focusManager.focus(null);
        }
    }
}