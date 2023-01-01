import * as THREE from 'three';
import { Room } from './room';
import { Scene } from './scene';

const width = 17;
const height = 17;
const offsetY = 4;

const defaultPosition = new THREE.Vector3(20, 18, 20);
const targetPosition = new THREE.Vector3(20, 3, 20);

export class Camera 
{
    scene: Scene;
    camera: THREE.OrthographicCamera;

    currentTarget: Room | null;

    transitionDuration: number = 1;
    transitionTime: number = 0;

    startPosition = new THREE.Vector3();
    startRotation = new THREE.Quaternion();
    startZoom: number = 1;

    targetPosition = new THREE.Vector3();
    targetRotation = new THREE.Quaternion();
    targetZoom: number = 1;

    constructor(scene: Scene)
    {
        this.scene = scene;
        this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2 + offsetY, height / - 2 + offsetY);
        this.camera.position.copy(defaultPosition);
        this.camera.lookAt( 0, 0, 0 );

        this.currentTarget = null;
        this.transitionTime = this.transitionDuration;

        this.scene.addObject(this.camera);

        this.scene.directionalLight.position.set(this.camera.position.x, this.camera.position.y + 4, this.camera.position.z);
    }

    public getDirection(): THREE.Vector3
    {
        var vector = new THREE.Vector3();
        this.camera.getWorldDirection(vector);
        return vector;
    }

    public isInTransition(): boolean
    {
        return this.transitionTime < this.transitionDuration;
    }

    public hasTarget(): boolean
    {
        return this.currentTarget != null;
    }

    public setTarget(target: Room | null)
    {
        if(this.currentTarget == target) return;

        this.currentTarget = target;

        this.startPosition.copy(this.camera.position);
        this.startRotation.setFromEuler(this.camera.rotation);
        this.startZoom = this.camera.zoom;

        this.transitionTime = 0;

        if(this.currentTarget == null)
        {
            var targetMatrix = new THREE.Matrix4();
            targetMatrix.lookAt(defaultPosition, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0));

            this.targetPosition.copy(defaultPosition);
            this.targetRotation.setFromRotationMatrix(targetMatrix);
            this.targetZoom = 1;
        }
        else
        {
            var targetMatrix = new THREE.Matrix4();
            targetMatrix.lookAt(targetPosition, new THREE.Vector3(0,0.6,0), new THREE.Vector3(0,1,0));

            this.targetPosition.copy(targetPosition);
            this.targetRotation.setFromRotationMatrix(targetMatrix);
            this.targetZoom = 1.34;
        }
    }
    
    public tick(dt: DOMHighResTimeStamp)
    {
        if(this.transitionTime >= this.transitionDuration) return;

        this.transitionTime += dt;
        let t = Math.min(this.transitionTime / this.transitionDuration, 1.0);

        let position = new THREE.Vector3();
        position.lerpVectors(this.startPosition, this.targetPosition, t);
        let rotation = new THREE.Quaternion();
        rotation.slerpQuaternions(this.startRotation, this.targetRotation, t);
        let zoom = THREE.MathUtils.lerp(this.startZoom, this.targetZoom, t);

        this.camera.position.copy(position);
        this.camera.rotation.setFromQuaternion(rotation);
        this.camera.zoom = zoom;
        this.camera.updateProjectionMatrix();
    }
}