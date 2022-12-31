import * as THREE from 'three';

export const TWOPI = Math.PI * 2;

// Angle in radians;
export function normalizeAngle(angle: number): number
{
    // reduce the angle  
    angle =  angle % TWOPI; 

    // force it to be the positive remainder, so that 0 <= angle < 360  
    angle = (angle + TWOPI) % TWOPI;  

    // force into the minimum absolute value residue class, so that -180 < angle <= 180  
    if (angle > Math.PI)
    {
        angle -= TWOPI;
    }
    
    return angle;
}

export function lerpAngle(a: number, b: number, t: number): number
{
    if (Math.abs(a-b) >= Math.PI)
    {
        if(a > b)
            a = normalizeAngle(a) - 2.0 * Math.PI;
        else
            b = normalizeAngle(b) - 2.0 * Math.PI;
    }
    return THREE.MathUtils.lerp(a, b, t)
}