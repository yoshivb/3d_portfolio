import * as THREE from 'three';
import { AssetImporter } from './assetimporter';
import { Camera } from './camera';
import { Renderer } from './renderer'
import { Room } from './room';
import { Scene } from './scene';

export class App 
{
    canvas: HTMLCanvasElement;
    renderer: Renderer;
    scene: Scene;
    camera: Camera;
    assetImporter: AssetImporter;

    //todo Move into other class
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
        
        this.renderer.scene = this.scene.scene;
        this.renderer.camera = this.camera.camera;
        this.renderer.addTick((time) => this.tick(time));

        this.assetImporter = new AssetImporter(this.scene);

        this.gamesRoom = new Room("games", this.assetImporter, this.camera);
        this.hobbyRoom = new Room("hobbies", this.assetImporter, this.camera);
        this.volunteerRoom = new Room( "volunteer", this.assetImporter, this.camera);
        this.contactRoom = new Room("contact", this.assetImporter, this.camera);
        this.floor = new Room("floor", this.assetImporter, this.camera);
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
        let dt = currentTime - this.previousTimestamp;
        
        //Todo make a proper loading manager
        let allLoaded = this.floor.mainGroup !== undefined && this.gamesRoom.mainGroup !== undefined && this.hobbyRoom.mainGroup !== undefined && this.volunteerRoom.mainGroup !== undefined && this.contactRoom.mainGroup !== undefined;
        if(allLoaded)
        {
            this.floor.tick(dt);
            this.gamesRoom.tick(dt);
            this.hobbyRoom.tick(dt);
            this.volunteerRoom.tick(dt);
            this.contactRoom.tick(dt);
        }

        this.previousTimestamp = currentTime;
    }
}