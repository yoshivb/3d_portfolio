
import * as THREE from 'three';
import { Camera } from './camera';
import { Clickable } from './clickable';
import { Room } from './room';
import { RoomManager } from './roommanager';

export class FocusChangedEvent implements THREE.BaseEvent
{
    type = "changed";
    oldObject: Room|Clickable|null = null;
    newObject: Room|Clickable|null = null;
}

export class FocusManager extends THREE.EventDispatcher<FocusChangedEvent>
{
    camera: Camera;
    roomManager: RoomManager;

    focusedObject: Room|Clickable|null;
    lastFocusedObject: Room|Clickable|null;

    constructor(camera: Camera, rooms: RoomManager)
    {
        super();

        this.camera = camera;
        this.roomManager = rooms;

        this.focusedObject = null;
        this.lastFocusedObject = null;

        for(let room of this.roomManager.rooms)
        {
            room.setFocusManager(this);
        }
    }

    public focus(object: Room|Clickable|null)
    {
        if(this.focusedObject == object) return;

        let event = new FocusChangedEvent();
        event.oldObject = this.focusedObject;
        event.newObject = object;

        this.lastFocusedObject = this.focusedObject;
        this.focusedObject = object;

        this.dispatchEvent(event);
        this.onFocusChanged();
    }

    private onFocusChanged()
    {
        if(this.focusedObject instanceof Room)
        {
            this.camera.setTarget(this.focusedObject);
            this.roomManager.focusRoom(this.focusedObject);
        }
        else if(this.focusedObject instanceof Clickable)
        {
            //todo
        }
        else
        {
            this.camera.setTarget(null);
            this.roomManager.unfocusRoom();
        }
    }
}