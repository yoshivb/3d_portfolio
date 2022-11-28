import * as THREE from 'three';

export function remap(inValue: number, inMin: number, inMax: number, outMin: number, outMax: number): number
{
    let t = THREE.MathUtils.inverseLerp(inMin, inMax, inValue);
    t = THREE.MathUtils.clamp(t, 0, 1);
    return THREE.MathUtils.lerp(outMin, outMax, t);
}