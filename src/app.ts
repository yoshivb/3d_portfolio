import * as THREE from 'three';
import { AssetImporter } from './assetimporter';
import { Camera } from './camera';
import { Renderer } from './renderer'
import { Room } from './room';
import { Scene } from './scene';
import { SpinControls, SpinChangedEvent } from './spincontrols';
import { RoomManager } from './roommanager';
import { FocusChangedEvent, FocusManager } from './focusmanager';

export class App 
{
    canvas: HTMLCanvasElement;
    renderer: Renderer;
    scene: Scene;
    camera: Camera;
    assetImporter: AssetImporter;
    spinControls: SpinControls;
    roomManager: RoomManager;
    focusManager: FocusManager

    previousTimestamp: DOMHighResTimeStamp;

    constructor(canvas: HTMLCanvasElement)
    {
        this.previousTimestamp = 0;

        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.scene = new Scene();
        this.camera = new Camera(this.scene);
        this.spinControls = new SpinControls(document.body);
        this.spinControls.enableDamping = true;
        this.spinControls.addEventListener("changed", (ev) => this.roomManager.onSpin(ev));

        this.renderer.scene = this.scene.scene;
        this.renderer.camera = this.camera.camera;
        this.renderer.addTick((time) => this.tick(time));

        this.assetImporter = new AssetImporter(this.scene);
        
        this.roomManager = new RoomManager(this.scene, this.assetImporter, this.camera);
        this.renderer.setRoomManager(this.roomManager);
        
        this.focusManager = new FocusManager(this.camera, this.roomManager);
        this.focusManager.addEventListener("changed", (ev) => this.onFocusChanged(ev));
    }

    public start()
    {
        this.roomManager.load();
        this.renderer.render(0);
    }

    public tick(currentTime: DOMHighResTimeStamp)
    {
        let dt = (currentTime - this.previousTimestamp)/1000;
        
        if(this.roomManager.loadingFinished())
        {
            this.roomManager.tick(dt);
            this.spinControls.update();
        }

        this.camera.tick(dt);
        this.previousTimestamp = currentTime;
    }

    private onFocusChanged(event: FocusChangedEvent)
    {
        if(event.newObject == null)
        {
           this.spinControls.enabled = true;
        }
        else
        {
            this.spinControls.enabled = false;
        }
    }
}