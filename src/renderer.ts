import * as THREE from 'three';

export class Renderer 
{
    canvas: HTMLCanvasElement;
    renderer: THREE.WebGLRenderer;

    scene: THREE.Scene | undefined;
    camera: THREE.Camera | undefined;
    raycaster: THREE.Raycaster | undefined;

    pointer: THREE.Vector2;
    hoveringObject: THREE.Object3D | null;
    hoveringGroup: THREE.Group | null;

    callbacks: FrameRequestCallback[];

    constructor(canvas: HTMLCanvasElement)
    {
        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.VSMShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.CineonToneMapping;
        this.renderer.toneMappingExposure = 1.5;

        this.hoveringObject = null;
        this.hoveringGroup = null;
        this.pointer = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.raycaster.layers.set(1);

        let smallestValue = Math.min(window.innerHeight, window.innerWidth);
        this.renderer.setSize( smallestValue, smallestValue );

        window.addEventListener("resize", (ev) => this.onResize(ev));
        window.addEventListener("pointermove", (ev) => this.onPointerMove(ev));
        //Todo: test touchscreen
        window.addEventListener("pointerdown", (ev) => this.onPointerMove(ev));

        this.callbacks = [];
    }

    private onResize(event: UIEvent)
    {
        let smallestValue = Math.min(window.innerHeight, window.innerWidth);
        this.renderer.setSize( smallestValue, smallestValue );
    }

    private onPointerMove(event: PointerEvent ) 
    {
        let canvasBounds = this.canvas.getBoundingClientRect();
        let windowX = event.clientX - canvasBounds.x;
        let windowY = event.clientY - canvasBounds.y;
        
        this.pointer.x = (windowX / canvasBounds.width) * 2 - 1;
        this.pointer.y = - (windowY / canvasBounds.width) * 2 + 1;
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

        if(this.raycaster)
        {
            this.raycaster.setFromCamera(this.pointer, this.camera);
            const intersecting = this.raycaster.intersectObjects( this.scene.children );
            
            const newHoveringObject = intersecting.length > 0 ? intersecting[0].object : null;
            if(this.hoveringObject != newHoveringObject)
            {
                if(this.hoveringObject != null)
                {
                    this.hoveringObject.dispatchEvent({type:'onhoverstop'});
                }
                if(newHoveringObject != null)
                {
                    newHoveringObject.dispatchEvent({type:'onhoverstart'});
                }
                this.hoveringObject = newHoveringObject;
            }
            let newHoveringGroup: THREE.Group | null = null;
            if(newHoveringObject)
            {
                newHoveringObject.traverseAncestors((obj) => {
                    if(newHoveringGroup == null)
                    {
                        let group = obj as THREE.Group;
                        if(group && group.isGroup)
                            newHoveringGroup = group;
                    }
                });
            }
            if(this.hoveringGroup != newHoveringGroup)
            {
                if(this.hoveringGroup != null)
                {
                    this.hoveringGroup.dispatchEvent({type:'onhoverstop'});
                }
                if(newHoveringGroup != null)
                {
                    (newHoveringGroup as THREE.Group).dispatchEvent({type:'onhoverstart'});
                }
                this.hoveringGroup = newHoveringGroup;
            }
        }

        requestAnimationFrame( (dt) => this.render(dt) );
        this.renderer.render( this.scene, this.camera );
    }
}