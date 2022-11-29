import * as THREE from 'three';

export class Renderer 
{
    canvas: HTMLCanvasElement;
    renderer: THREE.WebGLRenderer;

    scene: THREE.Scene | undefined;
    camera: THREE.Camera | undefined;

    callbacks: FrameRequestCallback[];

    constructor(canvas: HTMLCanvasElement)
    {
        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.VSMShadowMap;

        //todo: add resizing support
        let smallestValue = Math.min(window.innerHeight, window.innerWidth);
        this.renderer.setSize( smallestValue, smallestValue );

        this.callbacks = [];
    }

    public addTick(callback: FrameRequestCallback)
    {
        this.callbacks.push(callback);
    }

    public removeTick(callback: FrameRequestCallback)
    {
        let index = this.callbacks.indexOf(callback);
        if(index != -1)
        {
            this.callbacks.splice(index, 1);
        }
    }

    public render(dt: DOMHighResTimeStamp)
    {
        if(!this.scene || !this.camera)
            return;
        
        for(let callback of this.callbacks)
        {
            callback(dt);
        }

        requestAnimationFrame( (dt) => this.render(dt) );
        this.renderer.render( this.scene, this.camera );
    }
}