import * as THREE from 'three';

import Main_Vert from './shaders/main_vert.glsl'
import Main_Frag from './shaders/main_frag.glsl'

export class MainMaterial extends THREE.ShaderMaterial 
{
    constructor(material: THREE.Material, parameters?: THREE.ShaderMaterialParameters) 
    {
        super(parameters);

        this.uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib.common,
            THREE.UniformsLib.lights,
        {
            diffuse: {value: new THREE.Vector3(1, 1, 1)},
            opacity: {value: 1.0},
            emissive: {value: new THREE.Vector3(0, 0, 0)},
            map: {type: "t",
                value: null as THREE.Texture|null
            },
            screenSize: {value: new THREE.Vector2(0,0)},
            time: {value: 0.0}
        }]);
        this.defines = {
            USE_MAP: false,
            USE_UV: false
        };

        let lambdaMaterial = material as THREE.MeshLambertMaterial;
        if(lambdaMaterial)
        {
            this.uniforms.diffuse.value = new THREE.Vector3(lambdaMaterial.color.r, lambdaMaterial.color.g, lambdaMaterial.color.b);
            this.uniforms.opacity.value = lambdaMaterial.opacity;
            this.uniforms.emissive.value = new THREE.Vector3(lambdaMaterial.emissive.r, lambdaMaterial.emissive.g, lambdaMaterial.emissive.b);
            this.uniforms.map.value = lambdaMaterial.map;

            if(lambdaMaterial.map != null)
            {
                this.defines.USE_MAP = true;
                this.defines.USE_UV = true;
            }
        }

        this.lights = true,
        this.transparent = this.uniforms.opacity.value < 1.0;

        this.fragmentShader = Main_Frag;
        this.vertexShader = Main_Vert;
    }

    onBeforeRender(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) 
    {
		const viewport = new THREE.Vector4();

        renderer.getCurrentViewport( viewport );

        const ViewportWidth = viewport.z;
        const ViewportHeight = viewport.w;

        let currentTime = performance.now() / 1000.0;

        (this.uniforms.screenSize.value as THREE.Vector2).set(ViewportWidth, ViewportHeight);
        (this.uniforms.time.value as number) = currentTime;
    }
}