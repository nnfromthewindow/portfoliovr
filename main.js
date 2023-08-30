import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';

const loader = new GLTFLoader();

function modelLoader(url) {
    return new Promise((resolve, reject) => {
      loader.load(url, data=> resolve(data), null, reject);
    });
  }



  async function main() {

	const clock = new THREE.Clock();

    const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
	renderer.shadowMap.enabled = true;

	const fov = 45;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 100;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( 4,2,-1);
	camera.lookAt(-2,0,0)
    
	
	const controls = new FirstPersonControls( camera, renderer.domElement );
	controls.movementSpeed = 150;
	controls.lookSpeed = 0.5;
/*
	const controls = new OrbitControls( camera, canvas );
	controls.target.set( -2, 0, 0 );
	controls.enableDamping = true;
	controls.update();
*/
	const scene = new THREE.Scene();
	scene.background = new THREE.Color( '#DEFEFF' );

    const gltfData = await modelLoader('/assets/blender_test.gltf')

    
    const model = gltfData.scene;

    gltfData.scene.children[3].intensity =50
    
	scene.add(model);
	
	console.log(gltfData)


function resizeRendererToDisplaySize( renderer ) {

    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if ( needResize ) {

        renderer.setSize( width, height, false );

    }

    return needResize;

}



const mixer = new THREE.AnimationMixer( gltfData.scene );

mixer.clipAction( gltfData.animations[ 1 ] ).play();

	function render( time ) {

		time *= 0.00001;

        const delta = clock.getDelta();
		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}

     
		renderer.render( scene, camera );
       // controls.update();
	   controls.update( clock.getDelta() );
		mixer.update(delta)
		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main().catch(error => {
    console.error(error);
  });

