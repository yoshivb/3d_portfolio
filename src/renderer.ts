import * as THREE from 'three';
import { Clickable } from './clickable';
import { Room } from './room';
import { RoomManager } from './roommanager';

export class Renderer 
{
    canvas: HTMLCanvasElement;
    renderer: THREE.WebGLRenderer;

    scene: THREE.Scene | undefined;
    camera: THREE.Camera | undefined;
    raycaster: THREE.Raycaster | undefined;

    roomManager: RoomManager|null;

    pointer: THREE.Vector2;
    hoveringObject: Clickable | null;

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
        this.pointer = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.raycaster.layers.set(1);

        this.roomManager = null;

        let smallestValue = Math.min(window.innerHeight, window.innerWidth);
        this.renderer.setSize( smallestValue, smallestValue );

        window.addEventListener("resize", (ev) => this.onResize(ev));
        window.addEventListener("pointermove", (ev) => this.onPointerMove(ev));
        //Todo: test touchscreen
        window.addEventListener("pointerdown", (ev) => this.onClick(ev));

        this.callbacks = [];
    }

    public setRoomManager(roomManager: RoomManager)
    {
        this.roomManager = roomManager;
    }

    private onResize(event: UIEvent)
    {
        let smallestValue = Math.min(window.innerHeight, window.innerWidth);
        this.renderer.setSize( smallestValue, smallestValue );
    }

    private onClick(event: PointerEvent)
    {
        this.onPointerMove(event);
        
        if(this.hoveringObject != null)
        {
            this.hoveringObject.dispatchEvent({type:'onclick'});
        }
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
            
            let newHoveringObject: Clickable|null = null;
            if(this.roomManager)
            {
                for(let room of this.roomManager.getInteractableRooms())
                {
                    if(!room.isVisible) continue;

                    for(let clickable of room.clickables)
                    {
                        let collisionBox = clickable.getCollisionBox();
                        if(collisionBox != null && this.raycaster.ray.intersectsBox(collisionBox))
                        {
                            newHoveringObject = clickable;
                            break;
                        }
                    }

                    if(newHoveringObject != null)
                        break;
                }
            }

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
        }

        requestAnimationFrame( (dt) => this.render(dt) );
        this.renderer.render( this.scene, this.camera );
    }
}