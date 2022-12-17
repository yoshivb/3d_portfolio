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
            uvTransform: { value: /*@__PURE__*/ new THREE.Matrix3() },
            opacity: {value: 1.0}
        }]);
        this.defines.USE_UV = true;

        this.depthTest = false;
        this.depthWrite = false;
        this.transparent = true;
        this.opacity = 1.0;

        this.fragmentShader = Sprite_Frag;
        this.vertexShader = Sprite_Vert;
    }

    onBeforeRender(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) 
    {
        (this.uniforms.opacity.value as number) = this.opacity;
    }
}