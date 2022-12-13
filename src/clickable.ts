import * as THREE from 'three';
import { SpriteMaterial } from './spritematerial';

export interface IClickable
{
    name: string;
}

export class Clickable 
{
    name: string;
    refmesh: THREE.Mesh;

    plane: THREE.Mesh|null;
    scene: THREE.Scene|null;

    constructor(data: IClickable, refmesh: THREE.Mesh)
    {
        this.name = data.name;
        this.refmesh = refmesh;
        this.plane = null;
        this.scene = null;

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
            let geometry = new THREE.PlaneGeometry(0.3, 0.3);
            let material = new SpriteMaterial();
            this.plane = new THREE.Mesh(geometry, material);
            this.refmesh.add(this.plane);
        }
    }
}