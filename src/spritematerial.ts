import * as THREE from 'three';

import Sprite_Vert from './shaders/sprite_vert.glsl'
import Sprite_Frag from './shaders/sprite_frag.glsl'


export class SpriteMaterial extends THREE.ShaderMaterial 
{
    constructor() 
    {
        super({});

        this.uniforms = THREE.UniformsUtils.merge([
        {
            diffuse: {value: new THREE.Vector3(1, 1, 1)},
            uvTransform: { value: /*@__PURE__*/ new THREE.Matrix3() }
        }]);
        this.defines.USE_UV = true;

        this.depthTest = false;
        this.depthWrite = false;
        this.transparent = true;

        this.fragmentShader = Sprite_Frag;
        this.vertexShader = Sprite_Vert;
    }
}