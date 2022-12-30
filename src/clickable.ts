import * as THREE from 'three';
import { SpriteMaterial } from './spritematerial';

export interface IClickable
{
    name: string;
}

function easeOutElastic(x: number): number {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (x < 1 / d1) {
        return n1 * x * x;
    } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
}

export class Clickable 
{
    name: string;
    private visible: boolean;
    refobject: THREE.Object3D;
    
    plane: THREE.Mesh|null;
    scene: THREE.Scene|null;
    material: THREE.Material|null;

    private isHovered: boolean;
    interpDuration: number;
    private interpTime: number;

    constructor(data: IClickable, refmesh: THREE.Object3D)
    {
        this.name = data.name;
        this.visible = true;
        this.refobject = refmesh;
        this.plane = null;
        this.scene = null;
        this.material = null;
        this.isHovered = false;
        this.interpDuration = 0.4;
        this.interpTime = this.interpDuration;

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
            //this.refobject.add(this.plane);

            this.refobject.addEventListener("onhoverstart", () => this.onHoverStart());
            this.refobject.addEventListener("onhoverstop", () => this.onHoverStop());
        }
    }

    public tick(dt: DOMHighResTimeStamp)
    {
        if(this.interpTime < this.interpDuration)
        {
            this.interpTime += dt;

            this.interpTime = Math.min(this.interpTime, this.interpDuration);

            let t = this.interpTime / this.interpDuration;
            t = easeOutElastic(t);
            if(!this.isHovered)
            {
                t = 1.0 - t;
            }
            let value = (t * 0.2) + 1.0;

            this.refobject.scale.set(value, value, value);
        }
    }

    private onHoverStart()
    {
        this.isHovered = true;
        if(this.interpTime < this.interpDuration)
        {
            this.interpTime = this.interpDuration - this.interpTime;
        }
        else
        {
            this.interpTime = 0.0;
        }
    }

    private onHoverStop()
    {
        this.isHovered = false;
        if(this.interpTime < this.interpDuration)
        {
            this.interpTime = this.interpDuration - this.interpTime;
        }
        else
        {
            this.interpTime = 0.0;
        }
    }
}