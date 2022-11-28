import { App } from "./app";

const canvas = document.getElementById("app-canvas") as HTMLCanvasElement;
const app = new App(canvas);

app.start();

// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

// const width = 25;
// const height = 25;

// const canvas = document.getElementById("app-canvas") as HTMLCanvasElement;
// const scene = new THREE.Scene();
// const camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2);

// const renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});
// renderer.setSize( window.innerWidth, window.innerWidth );
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.VSMShadowMap; // default 

// const light = new THREE.AmbientLight( 0x555555 ); // soft white light
// scene.add( light );
// const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
// directionalLight.castShadow = true; 
// scene.add( directionalLight );

// directionalLight.shadow.camera.left = -25;
// directionalLight.shadow.camera.bottom = -25;
// directionalLight.shadow.camera.top = 25;
// directionalLight.shadow.camera.right = 25;

// directionalLight.shadow.mapSize.width = 1024;
// directionalLight.shadow.mapSize.height = 1024;
// directionalLight.shadow.camera.near = 1; 
// directionalLight.shadow.camera.far = 500; 
// directionalLight.shadow.normalBias = 0.1;

// camera.position.x = 20.4606;
// camera.position.y = 18.736;
// camera.position.z = 19.2535;

// camera.lookAt( 0, 0, 0 );

// directionalLight.position.set(camera.position.x, camera.position.y+1, camera.position.z);

// // Instantiate a loader
// const loader = new GLTFLoader();

// // Optional: Provide a DRACOLoader instance to decode compressed mesh data
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath( 'public/libs/draco/' );
// loader.setDRACOLoader( dracoLoader );

// loader.load(
// 	// resource URL
// 	'public/models/CubeRoom_Floor.glb',
// 	function ( gltf ) {
//         gltf.scene.traverse((obj) => {
//             obj.receiveShadow = true;
//         });
// 		scene.add( gltf.scene );
//     }, undefined, function ( error ) {

//         console.error( error );
    
//     }
// );
// loader.load(
// 	// resource URL
// 	'public/models/CubeRoom_Game.glb',
// 	function ( gltf ) {
//         gltf.scene.traverse((obj) => {
//             obj.castShadow = true;
//             obj.receiveShadow = true;
//             console.log(obj);
//         });
// 		scene.add( gltf.scene );
//     }, undefined, function ( error ) {

//         console.error( error );
    
//     }
// );
// loader.load(
// 	// resource URL
// 	'public/models/CubeRoom_Hobby.glb',
// 	function ( gltf ) {
//         gltf.scene.traverse((obj) => {
//             obj.castShadow = true;
//             obj.receiveShadow = true;
//         });
// 		scene.add( gltf.scene );
//     }, undefined, function ( error ) {

//         console.error( error );
    
//     }
// );

// function animate() {
// 	requestAnimationFrame( animate );
// 	renderer.render( scene, camera );
// }
// animate();