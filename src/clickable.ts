import * as THREE from 'three';

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

export class Clickable extends THREE.EventDispatcher
{
    name: string;
    refobject: THREE.Object3D;
    
    private scene: THREE.Scene|null;
    private collisionBox: THREE.Box3|null;

    private isHovered: boolean;
    interpDuration: number;
    private interpTime: number;

    constructor(data: IClickable, refmesh: THREE.Object3D)
    {
        super();

        this.name = data.name;

        this.refobject = refmesh;
        this.scene = null;
        this.collisionBox = null;

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
            this.collisionBox = new THREE.Box3().setFromObject( this.refobject );

            this.addEventListener("onhoverstart", () => this.onHoverStart());
            this.addEventListener("onhoverstop", () => this.onHoverStop());
        }
    }

    public getCollisionBox(): THREE.Box3|null
    {
        return this.collisionBox;
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

        if(this.refobject)
        {
            this.collisionBox?.setFromObject(this.refobject);
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