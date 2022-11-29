import {
	EventDispatcher,
    BaseEvent,
	MOUSE,
	Quaternion,
	Spherical,
	TOUCH,
	Vector2,
	Vector3
} from 'three';

enum STATE{
    NONE = -1,
    ROTATE = 0,
    TOUCH_ROTATE = 3
};

enum MouseButtons {
    LEFT = MOUSE.ROTATE,
    INVALID = -1
}

enum Touches {
    ONE = 0, //TOUCH.ROTATE
    INVALID = -1,
}

export class SpinChangedEvent implements BaseEvent
{
    type = "changed";
    theta: number = 0;
}

export class SpinControls extends EventDispatcher<SpinChangedEvent> {

    domElement:  HTMLElement;

    enabled: boolean;
    minAzimuthAngle: number;
    maxAzimuthAngle: number;

    enableDamping: boolean;
    dampingFactor: number;

    mouseButtons: Object;
    touches: Object;

    rotateSpeed = 1.0;

    //
    // internals
    //

    private state = STATE.NONE;
    private EPS = 0.000001;

    // current position in spherical coordinates
    private theta = 0;
    private thetaDelta = 0;

    private rotateStart = new Vector2();
    private rotateEnd = new Vector2();
    private rotateDelta = new Vector2();

    private pointers: PointerEvent[];
    private pointerPositions: Vector2[];
    
	constructor(domElement: HTMLElement) {

		super();

		this.domElement = domElement;
		this.domElement.style.touchAction = 'none'; // disable touch scroll

		// Set to false to disable this control
		this.enabled = true;

		// How far you can orbit horizontally, upper and lower limits.
		// If set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
		this.minAzimuthAngle = - Infinity; // radians
		this.maxAzimuthAngle = Infinity; // radians

		// Set to true to enable damping (inertia)
		// If damping is enabled, you must call controls.update() in your animation loop
		this.enableDamping = false;
		this.dampingFactor = 0.06;

		// Mouse buttons
		this.mouseButtons = { LEFT: MOUSE.ROTATE };

		// Touch fingers
		this.touches = { ONE: TOUCH.ROTATE };

        this.pointers = [];
        this.pointerPositions = [];

        this.domElement.addEventListener( 'contextmenu', (ev) => this.onContextMenu(ev) );

        this.domElement.addEventListener( 'pointerdown', (ev) => this.onPointerDown(ev) );
        this.domElement.addEventListener( 'pointercancel', (ev) => this.onPointerCancel(ev) );

        // force an update at start
        this.update();
    }

    private getAzimuthalAngle() 
    {
        return this.theta;
    
    };

    public reset()
    {
        this.theta = 0;
        this.update();
        this.state = STATE.NONE;
    };

    public update()
    {
        const twoPI = 2 * Math.PI;
    
        if ( this.enableDamping ) 
        {
            this.theta += this.thetaDelta * this.dampingFactor;
        } else {
            this.theta += this.thetaDelta;
        }

        // restrict theta to be between desired limits

        let min = this.minAzimuthAngle;
        let max = this.maxAzimuthAngle;

        if ( isFinite( min ) && isFinite( max ) ) {

            if ( min < - Math.PI ) min += twoPI; else if ( min > Math.PI ) min -= twoPI;

            if ( max < - Math.PI ) max += twoPI; else if ( max > Math.PI ) max -= twoPI;

            if ( min <= max ) {

                this.theta = Math.max( min, Math.min( max, this.theta ) );

            } else {

                this.theta = ( this.theta > ( min + max ) / 2 ) ?
                    Math.max( min, this.theta ) :
                    Math.min( max, this.theta );

            }

        }

        if ( this.enableDamping === true ) 
        {
            this.thetaDelta *= ( 1 - this.dampingFactor );
        } else {
            this.thetaDelta = 0;
        }

        let changedEvent = new SpinChangedEvent();
        changedEvent.theta = this.theta;

        this.dispatchEvent( changedEvent );    
    };

    public dispose() 
    {
        this.domElement.removeEventListener( 'contextmenu', (ev) => this.onContextMenu(ev) );
    
        this.domElement.removeEventListener( 'pointerdown', (ev) => this.onPointerDown(ev) );
        this.domElement.removeEventListener( 'pointercancel', (ev) => this.onPointerCancel(ev) );
    
        this.domElement.removeEventListener( 'pointermove', (ev) => this.onPointerMove(ev) );
        this.domElement.removeEventListener( 'pointerup', (ev) => this.onPointerUp(ev) );

    };
    
    private rotateLeft( angle: number ) 
    {
        this.thetaDelta += angle;
    }

    //Callbacks

    private handleMouseDownRotate( event: MouseEvent ) 
    {
        this.rotateStart.set( event.clientX, event.clientY );
    }

    private handleMouseMoveRotate( event: MouseEvent  ) 
    {
        this.rotateEnd.set( event.clientX, event.clientY );
    
        this.rotateDelta.subVectors( this.rotateEnd, this.rotateStart ).multiplyScalar( this.rotateSpeed );
    
        const element = this.domElement;
    
        this.rotateLeft( 2 * Math.PI * this.rotateDelta.x / element.clientHeight ); // yes, height
    
        this.rotateStart.copy( this.rotateEnd );
    
        //this.update();
    }

    private handleTouchStartRotate() 
    {
        if ( this.pointers.length === 1 ) {
    
            this.rotateStart.set( this.pointers[ 0 ].pageX, this.pointers[ 0 ].pageY );
    
        }
    }

    private handleTouchMoveRotate( event: PointerEvent ) {

        this.rotateEnd.set( event.pageX, event.pageY );

        this.rotateDelta.subVectors( this.rotateEnd, this.rotateStart ).multiplyScalar( this.rotateSpeed );

        const element = this.domElement;

        this.rotateLeft( 2 * Math.PI * this.rotateDelta.x / element.clientHeight ); // yes, height

        this.rotateStart.copy( this.rotateEnd );
    }
    
    private onPointerDown( event: PointerEvent ) {

        if ( this.enabled === false ) return;
    
        if ( this.pointers.length === 0 ) {
    
            this.domElement.setPointerCapture( event.pointerId );
    
            this.domElement.addEventListener( 'pointermove', (ev) => this.onPointerMove(ev) );
            this.domElement.addEventListener( 'pointerup', (ev) => this.onPointerUp(ev) );
    
        }
        
        this.addPointer( event );
    
        if ( event.pointerType === 'touch' ) {
            this.onTouchStart( event );
        } else {
            this.onMouseDown( event );
        }
    }

    
    private onPointerMove( event: PointerEvent ) 
    {
        if ( this.enabled === false ) return;

        if ( event.pointerType === 'touch' ) {
            this.onTouchMove( event );
        } else {
            this.onMouseMove( event );
        }
    }

    private onPointerUp( event: PointerEvent ) 
    {
        this.removePointer( event );
    
        if ( this.pointers.length === 0 ) {
    
            this.domElement.releasePointerCapture( event.pointerId );
    
            this.domElement.removeEventListener( 'pointermove', (ev) => this.onPointerMove(ev) );
            this.domElement.removeEventListener( 'pointerup', (ev) => this.onPointerUp(ev) );
    
        }
        // this.dispatchEvent( _endEvent );
        this.state = STATE.NONE;
    }

    private onPointerCancel( event: PointerEvent ) 
    {
        this.removePointer( event );
    }

    private onMouseDown( event: MouseEvent ) 
    {
        let mouseAction;
        switch ( event.button ) 
        {
            case 0:
                mouseAction = MouseButtons.LEFT;
                break;
            default:
                mouseAction  = MouseButtons.INVALID;
        }
    
        switch ( mouseAction as unknown as MOUSE ) 
        {
            case MOUSE.ROTATE:
                    this.handleMouseDownRotate( event );
                    this.state = STATE.ROTATE;
                break;
            default:
                this.state = STATE.NONE;
        }
    
        // if ( this.state !== STATE.NONE ) 
        // {
        //     this.dispatchEvent( _startEvent );
        // }
    }

    private onMouseMove( event: MouseEvent ) 
    {
        switch ( this.state ) {
            case STATE.ROTATE:
                this.handleMouseMoveRotate( event );
                break;
        }
    }

    private onTouchStart( event: PointerEvent ) 
    {
        this.trackPointer( event );
    
        this.handleTouchStartRotate();
        this.state = STATE.TOUCH_ROTATE;
    
        // this.dispatchEvent( _startEvent );
    }
    
    private onTouchMove( event: PointerEvent ) 
    {
        this.trackPointer( event );

        switch ( this.state ) {
            case STATE.TOUCH_ROTATE:
                this.handleTouchMoveRotate( event );
                //this.update();
                break;
    
            default:
                this.state = STATE.NONE;
    
        }
    }

    private onContextMenu( event: MouseEvent ) 
    {
        if ( this.enabled === false ) return;
        event.preventDefault();
    }

    
    private addPointer( event: PointerEvent ) 
    {
        this.pointers.push( event );
    }

    private removePointer( event: PointerEvent ) 
    {
        delete this.pointerPositions[ event.pointerId ];
    
        for ( let i = 0; i < this.pointers.length; i ++ ) 
        {
            if ( this.pointers[ i ].pointerId == event.pointerId ) 
            {
                this.pointers.splice( i, 1 );
                return;
            }
        }
    }
    
    private trackPointer( event: PointerEvent ) 
    {
        let position = this.pointerPositions[ event.pointerId ];
    
        if ( position === undefined ) 
        {
            position = new Vector2();
            this.pointerPositions[ event.pointerId ] = position;
        }

        position.set( event.pageX, event.pageY );
    }
}