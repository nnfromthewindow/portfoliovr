import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const loader = new GLTFLoader();

function modelLoader(url) {
    return new Promise((resolve, reject) => {
      loader.load(url, data=> resolve(data), null, reject);
    });
  }



  async function main() {

    const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
	renderer.shadowMap.enabled = true;

	const fov = 45;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 100;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( 4,2,-1);
    


	const controls = new OrbitControls( camera, canvas );
	controls.target.set( -2, 0, 0 );
	controls.update();

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


// Create an AnimationMixer, and get the list of AnimationClip instances
const mixer = new THREE.AnimationMixer( gltfData );
const clips = gltfData.animations;

// Update the mixer on each frame
function update () {
	mixer.update( deltaSeconds );
}

// Play a specific animation
const clip = THREE.AnimationClip.findByName( clips, 'rotacion_cabeza' );
const action = mixer.clipAction( clip );
action.play();
console.log(action)
// Play all animations
/*
clips.forEach( function ( clip ) {
	mixer.clipAction( clip ).play();
} );
*/
	function render( time ) {

		time *= 0.001;

        
		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}

     mixer.update(time)
		renderer.render( scene, camera );
        controls.update();
		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main().catch(error => {
    console.error(error);
  });

