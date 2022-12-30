import * as THREE from 'three';
import { AssetImporter } from './assetimporter';
import { Camera } from './camera';
import { Renderer } from './renderer'
import { Room } from './room';
import { Scene } from './scene';
import { SpinControls, SpinChangedEvent } from './spincontrols';

export class App 
{
    canvas: HTMLCanvasElement;
    renderer: Renderer;
    scene: Scene;
    camera: Camera;
    assetImporter: AssetImporter;
    spinControls: SpinControls;

    //Maybe move into other class?
    gamesRoom: Room;
    hobbyRoom: Room;
    volunteerRoom: Room;
    contactRoom: Room;
    floor: Room;

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
        this.spinControls.addEventListener("changed", (ev) => this.onRotate(ev));

        this.renderer.scene = this.scene.scene;
        this.renderer.camera = this.camera.camera;
        this.renderer.addTick((time) => this.tick(time));

        this.assetImporter = new AssetImporter(this.scene);

        this.gamesRoom = new Room("games", this.assetImporter, this.camera);
        this.hobbyRoom = new Room("hobbies", this.assetImporter, this.camera);
        this.volunteerRoom = new Room( "volunteer", this.assetImporter, this.camera);
        this.contactRoom = new Room("contact", this.assetImporter, this.camera);
        this.floor = new Room("floor", this.assetImporter, this.camera);

        window.addEventListener("keydown", (ev) => this.onKeyDown(ev));
    }

    public onKeyDown(ev: KeyboardEvent)
    {
        if(ev.key == "0")
        {
            this.unfocusRoom();
        }
        else if(ev.key == "1")
        {
            this.focusRoom(this.gamesRoom);
        }
        else if(ev.key == "2")
        {
            this.focusRoom(this.hobbyRoom);
        }
        else if(ev.key == "3")
        {
            this.focusRoom(this.volunteerRoom);
        }
        else if(ev.key == "4")
        {
            this.focusRoom(this.contactRoom);
        }
    }

    public start()
    {
        this.floor.load();
        this.gamesRoom.load();
        this.hobbyRoom.load();
        this.volunteerRoom.load();
        this.contactRoom.load();
        this.renderer.render(0);
    }

    public tick(currentTime: DOMHighResTimeStamp)
    {
        let dt = (currentTime - this.previousTimestamp)/1000;
        
        //Maybe make a proper loading manager?
        let allLoaded = this.floor.mainGroup !== undefined && this.gamesRoom.mainGroup !== undefined && this.hobbyRoom.mainGroup !== undefined && this.volunteerRoom.mainGroup !== undefined && this.contactRoom.mainGroup !== undefined;
        if(allLoaded)
        {
            this.gamesRoom.tick(dt);
            this.hobbyRoom.tick(dt);
            this.volunteerRoom.tick(dt);
            this.contactRoom.tick(dt);
            this.spinControls.update();
        }

        this.camera.tick(dt);

        this.previousTimestamp = currentTime;
    }

    public focusRoom(room: Room)
    {
        this.camera.setTarget(room);
        this.spinControls.enabled = false;

        //proof-of-concept
        let theta = -35 * THREE.MathUtils.DEG2RAD + room.getOffsetRotation(); //A small offset looks nice
        this.floor.setRotation(theta);
        this.gamesRoom.setRotation(theta);
        this.hobbyRoom.setRotation(theta);
        this.volunteerRoom.setRotation(theta);
        this.contactRoom.setRotation(theta);
    }

    public unfocusRoom()
    {
        this.camera.setTarget(null);
        this.spinControls.enabled = true;
    }

    private onRotate(event: SpinChangedEvent)
    {
        if(!this.spinControls.enabled) return;
        this.floor.setRotation(event.theta);
        this.gamesRoom.setRotation(event.theta);
        this.hobbyRoom.setRotation(event.theta);
        this.volunteerRoom.setRotation(event.theta);
        this.contactRoom.setRotation(event.theta);
    }
}