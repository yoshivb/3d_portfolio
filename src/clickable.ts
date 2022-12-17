import * as THREE from 'three';
import { SpriteMaterial } from './spritematerial';

export interface IClickable
{
    name: string;
}

export class Clickable 
{
    name: string;
    private visible: boolean;
    refobject: THREE.Object3D;

    plane: THREE.Mesh|null;
    scene: THREE.Scene|null;
    material: THREE.Material|null;

    constructor(data: IClickable, refmesh: THREE.Object3D)
    {
        this.name = data.name;
        this.visible = true;
        this.refobject = refmesh;
        this.plane = null;
        this.scene = null;
        this.material = null;

        let position = new THREE.Vector3();
        refmesh.getWorldPosition(position);

        refmesh.traverseAncestors((obj) =>
        {
            let scene = obj as THREE.Scene;
            if(scene && scene.isScene)
            {
                this.scene = scene;
            }
        });

        if(this.scene != null)
        {
            this.refobject.layers.enable(1);
            this.refobject.traverse((obj) => obj.layers.enable(1));

            let geometry = new THREE.PlaneGeometry(0.3, 0.3);
            this.material = new SpriteMaterial();
            this.material.opacity = 0.5;
            this.plane = new THREE.Mesh(geometry, this.material);
            this.refobject.add(this.plane);

            this.refobject.addEventListener("onhoverstart", () => this.onHoverStart());
            this.refobject.addEventListener("onhoverstop", () => this.onHoverStop());
        }
    }

    public updateVisibility(visible: boolean)
    {
        this.visible = visible;
        if(this.plane)
            this.plane.visible = visible;
    }

    private onHoverStart()
    {
        if(this.material)
            this.material.opacity = 0.9;
        if(this.plane)
            this.plane.scale.set(1.2, 1.2, 1.2);
    }

    private onHoverStop()
    {
        if(this.material)
            this.material.opacity = 0.5;
        if(this.plane)
            this.plane.scale.set(1.0, 1.0, 1.0);
    }
}