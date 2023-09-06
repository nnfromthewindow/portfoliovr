import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Octree } from 'three/addons/math/Octree.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';
import { Capsule } from 'three/addons/math/Capsule.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

const loader = new GLTFLoader();

function modelLoader(url) {
	return new Promise((resolve, reject) => {
		loader.load(url, data=> resolve(data), null, reject);
	});
	}

const clock = new THREE.Clock();

const scene = new THREE.Scene();
//scene.background = new THREE.Color( 0x88ccee );
scene.fog = new THREE.Fog( 0x88ccee, 0, 50 );

const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.rotation.order = 'YXZ';



const container = document.getElementById( 'container' );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
container.appendChild( renderer.domElement );


const GRAVITY = 30;

const STEPS_PER_FRAME = 5;


const worldOctree = new Octree();

const playerCollider = new Capsule( new THREE.Vector3( 0, 0.35, 0 ), new THREE.Vector3( 0, 1.8, 0 ), 0.35 );

const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();

let playerOnFloor = false;
let mouseTime = 0;

const keyStates = {};

const vector1 = new THREE.Vector3();
const vector2 = new THREE.Vector3();
const vector3 = new THREE.Vector3();

document.addEventListener( 'keydown', ( event ) => {

	keyStates[ event.code ] = true;

} );

document.addEventListener( 'keyup', ( event ) => {

	keyStates[ event.code ] = false;


} );

container.addEventListener( 'mousedown', () => {


		document.body.requestPointerLock();

		mouseTime = performance.now();		

} );




/*
			document.addEventListener( 'mouseup', () => {

				if ( document.pointerLockElement !== null ) throwBall();

			} );
*/
			document.body.addEventListener( 'mousemove', ( event ) => {

				if ( document.pointerLockElement === document.body ) {

					camera.rotation.y -= event.movementX / 500;
					camera.rotation.x -= event.movementY / 500;

				}

				//if(document.pointerLockElement == null) console.log("hola")

			} );

		

			window.addEventListener( 'resize', onWindowResize );

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}
/*
			function throwBall() {

				const sphere = spheres[ sphereIdx ];

				camera.getWorldDirection( playerDirection );

				sphere.collider.center.copy( playerCollider.end ).addScaledVector( playerDirection, playerCollider.radius * 1.5 );

				// throw the ball with more force if we hold the button longer, and if we move forward

				const impulse = 15 + 30 * ( 1 - Math.exp( ( mouseTime - performance.now() ) * 0.001 ) );

				sphere.velocity.copy( playerDirection ).multiplyScalar( impulse );
				sphere.velocity.addScaledVector( playerVelocity, 2 );

				sphereIdx = ( sphereIdx + 1 ) % spheres.length;

			}
*/ 
			function playerCollisions() {

				const result = worldOctree.capsuleIntersect( playerCollider );

				playerOnFloor = false;

				if ( result ) {

					playerOnFloor = result.normal.y > 0;

					if ( ! playerOnFloor ) {

						playerVelocity.addScaledVector( result.normal, - result.normal.dot( playerVelocity ) );

					}

					playerCollider.translate( result.normal.multiplyScalar( result.depth ) );

				}

			}

			function updatePlayer( deltaTime ) {

				let damping = Math.exp( - 4 * deltaTime ) - 1;

				if ( ! playerOnFloor ) {

					playerVelocity.y -= GRAVITY * deltaTime;

					// small air resistance
					damping *= 0.1;

				}

				playerVelocity.addScaledVector( playerVelocity, damping );

				const deltaPosition = playerVelocity.clone().multiplyScalar( deltaTime );
				playerCollider.translate( deltaPosition );

				playerCollisions();

				camera.position.copy( playerCollider.end );

			}



			function getForwardVector() {

				camera.getWorldDirection( playerDirection );
				playerDirection.y = 0;
				playerDirection.normalize();

				return playerDirection;

			}

			function getSideVector() {

				camera.getWorldDirection( playerDirection );
				playerDirection.y = 0;
				playerDirection.normalize();
				playerDirection.cross( camera.up );

				return playerDirection;

			}

			function controls( deltaTime ) {

				// gives a bit of air control
				const speedDelta = deltaTime * ( playerOnFloor ? 25 : 8 );

				if ( keyStates[ 'KeyW' ] ) {

					playerVelocity.add( getForwardVector().multiplyScalar( speedDelta ) );

				}

				if ( keyStates[ 'KeyS' ] ) {

					playerVelocity.add( getForwardVector().multiplyScalar( - speedDelta ) );

				}

				if ( keyStates[ 'KeyA' ] ) {

					playerVelocity.add( getSideVector().multiplyScalar( - speedDelta ) );

				}

				if ( keyStates[ 'KeyD' ] ) {

					playerVelocity.add( getSideVector().multiplyScalar( speedDelta ) );

				}


				if ( playerOnFloor ) {

					if ( keyStates[ 'Space' ] ) {

						playerVelocity.y = 10;

					}

				}

			}

			const gltfData = await modelLoader('/assets/blender_test.gltf')

			
			const model = gltfData.scene;

			model.children[3].intensity =20
			model.children[4].intensity =20
			model.children[7].intensity =20
			model.children[8].intensity =20
			model.children[9].intensity =20
			model.children[10].intensity =20
	
		/*	model.children[11].children[0].intensity =20
			model.children[11].children[1].intensity =20
			model.children[11].children[2].intensity =20
			model.children[11].children[3].intensity =20
			model.children[11].children[4].intensity =20
			model.children[11].children[5].intensity =20
			model.children[11].children[6].intensity =20	
			model.children[11].children[7].intensity =20
			model.children[11].children[8].intensity =20
			model.children[11].children[9].intensity =20
			model.children[11].children[10].intensity =20
			model.children[11].children[11].intensity =20
			model.children[11].children[12].intensity =20
			model.children[11].children[13].intensity =20
			model.children[11].children[14].intensity =20
*/
			model.children[31].intensity =20
			model.children[32].intensity =20
			model.children[33].intensity =20
			model.children[34].intensity =20
			model.children[38].intensity =20
	
			model.children[67].intensity =20
			model.children[68].intensity =20
			
			
			model.children[70].intensity =20
			model.children[72].intensity =20
			model.children[74].intensity =20
			model.children[79].intensity =20
			model.children[80].intensity =2
			model.children[81].intensity =20




	
			scene.add(model);
			
			console.log(gltfData.scene.children)

			

			worldOctree.fromGraphNode(model);

			model.traverse( child => {

				if ( child.isMesh ) {

					child.castShadow = true;
					child.receiveShadow = true;

					if ( child.material.map ) {

						//child.material.map.anisotropy = 4;

					}

				}

			} );

			const helper = new OctreeHelper( worldOctree );
			helper.visible = false;
			scene.add( helper );

			
				


			function teleportPlayerIfOob() {

				if ( camera.position.y <= - 25 ) {

					playerCollider.start.set( 0, 0.35, 0 );
					playerCollider.end.set( 0, 1, 0 );
					playerCollider.radius = 0.35;
					camera.position.copy( playerCollider.end );
					camera.rotation.set( 0, 0, 0 );

				}

			}




			const mixer = new THREE.AnimationMixer( gltfData.scene );

			mixer.clipAction( gltfData.animations[ 1 ] ).play();


			function animate() {

				const deltaTime = Math.min( 0.05, clock.getDelta() ) / STEPS_PER_FRAME;

				// we look for collisions in substeps to mitigate the risk of
				// an object traversing another too quickly for detection.

				for ( let i = 0; i < STEPS_PER_FRAME; i ++ ) {

					controls( deltaTime );

					updatePlayer( deltaTime );


					teleportPlayerIfOob();

				}

				mixer.update(deltaTime)

				renderer.render( scene, camera );


				requestAnimationFrame( animate );

			}

			animate();