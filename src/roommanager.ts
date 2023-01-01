
import * as THREE from 'three';
import { Scene } from './scene';
import { Room } from './room';
import { Camera } from './camera';
import { AssetImporter } from './assetimporter';
import * as ExtraMath from './helpers/math'

import { models } from './assets.json'
import { SpinChangedEvent } from './spincontrols';
type ModelKey = keyof typeof models;

export class RoomManager 
{
    scene: Scene;
    rooms: Room[]; //Dictionary?

    assetImporter: AssetImporter;
    camera: Camera;

    transitionDuration: number = 1;
    transitionTime: number = 0;

    startRotation: number = 0;
    targetRotation: number = 0;
    currentRotation: number = 0;
    storedRotation: number = 0;
    
    constructor(scene: Scene, assetImporter: AssetImporter, camera: Camera)
    {
        this.scene = scene;
        this.assetImporter = assetImporter;
        this.camera = camera;
        this.rooms = [];

        this.transitionTime = this.transitionDuration;

        let roomId: ModelKey;
        for(roomId in models)
        {
            this.rooms.push(new Room(roomId, this.assetImporter, this.camera))
        }
    }

    public getInteractableRooms()
    {
        return this.rooms;
    }

    public load()
    {
        for(let room of this.rooms)
        {
            room.load();
        }
    }

    public loadingFinished(): boolean
    {
        let finished = true;
        for(let room of this.rooms)
        {
            if(room.mainGroup === undefined)
            {
                finished = false;
                break;
            }
        }
        return finished;
    }

    public onSpin(event: SpinChangedEvent)
    {
        if(this.transitionTime < this.transitionDuration) return;
        this.setRotation(event.theta);
        this.currentRotation = event.theta;
        this.storedRotation = event.theta;
    }

    public setRotation(theta: number)
    {
        for(let room of this.rooms)
        {
            room.setRotation(theta);
        }
    }

    public tick(dt: DOMHighResTimeStamp)
    {
        if(this.transitionTime < this.transitionDuration)
        {
            this.transitionTime += dt;
            let t = Math.min(this.transitionTime / this.transitionDuration, 1.0);
    
            let rotation = ExtraMath.lerpAngle(this.startRotation, this.targetRotation, t);
            this.setRotation(rotation);
        }

        for(let room of this.rooms)
        {
            room.tick(dt);
        }
    }

    public focusRoom(room: Room)
    {
        let theta = -35 * THREE.MathUtils.DEG2RAD + room.getOffsetRotation(); //A small offset looks nice

        this.targetRotation = theta;
        this.startRotation = this.currentRotation;
        this.currentRotation = this.targetRotation;

        this.transitionTime = 0;
    }

    public unfocusRoom()
    {
        this.targetRotation = this.storedRotation;
        this.startRotation = this.currentRotation;
        this.currentRotation = this.targetRotation;

        this.transitionTime = 0;
    }
}