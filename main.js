import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Octree } from 'three/addons/math/Octree.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';
import { Capsule } from 'three/addons/math/Capsule.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { TextureLoader } from 'three';

const loader = new GLTFLoader();

function modelLoader(url) {
	return new Promise((resolve, reject) => {
		loader.load(url, data=> resolve(data), null, reject);
	});
	}

const clock = new THREE.Clock();

const scene = new THREE.Scene();
//scene.background = new THREE.Color( 0x88ccee );
//scene.fog = new THREE.Fog( 0x88ccee, 0, 50 );

const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.rotation.order = 'YXZ';
camera.rotation.set( 0, -80.11, 0 );




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

const playerCollider = new Capsule( new THREE.Vector3( 3, 0.35, 0 ), new THREE.Vector3( 3, 1.8, 0 ), 0.35 );

const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();


let playerOnFloor = false;
let mouseTime = 0;
let flag = false;

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

container.addEventListener( 'mousedown', (e) => {
	flag=false
		document.body.requestPointerLock();

		mouseTime = performance.now();		
	setTimeout(()=>{
	flag =true
	},1000)
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

			const loadManager = new THREE.LoadingManager();
			const imageLoader = new THREE.TextureLoader(loadManager);
			//const texture = new THREE.TextureLoader().load('assets/frente.jpg');
			

			const materials = [
				new THREE.MeshBasicMaterial({map: imageLoader.load('assets/frente.jpg')}),
				new THREE.MeshBasicMaterial({map: imageLoader.load('assets/interior.jpg')}),
				new THREE.MeshBasicMaterial({map: imageLoader.load('assets/barra.jpg')}),
						
			]

			
			scene.add(model);
			 
			console.log(gltfData.scene.children)
			
			worldOctree.fromGraphNode(model);

			model.traverse( child => {

				if(child.isLight){
				child.intensity =100

				}
				if(child.name == "Point_home"){
					child.intensity =200
				}
				if(child.name == "cinema_screen"){
					loadManager.onLoad = () => {
						child.material.map = materials[0].map
						child.material.map.wrapS = THREE.RepeatWrapping;
						child.material.map.wrapT = THREE.RepeatWrapping;
						child.material.map.rotation = Math.PI/2
						
					  };
				}
				if(child.name == "boundary"){
					child.visible = false
				}
				if(child.name == "Point_playroom"){
					child.intensity =1000
				}
				if(child.name == "Point_playroom2"){
					child.intensity =100
				}
				if(child.name == "Point_playroom3"){
					child.intensity =1000
				}
				if(child.name == "Point_stack2"){
					child.intensity =10
				}
				if(child.name == "Point_cinema2"){
					child.intensity =10
				}

				if ( child.isMesh ) {
					child.castShadow = true;
					child.receiveShadow = true;
				}

				if(child.name == "linkedin_box"){
					child.visible = false
				}

				if(child.name == "github_box"){
					child.visible = false
				}

				if(child.name == "mail_box"){
					child.visible = false
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
			mixer.clipAction( gltfData.animations[ 2 ] ).play();


//PICK FUNCTION
class PickHelper {
	constructor() {
	  this.raycaster = new THREE.Raycaster();
	  this.pickedObject = null;
	  this.pickedObjectSavedColor = 0;
	
	}
	pick(normalizedPosition, scene, camera, time) {
	  // restore the color if there is a picked object
	  if (this.pickedObject) {
		this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
		this.pickedObject = undefined;
	  }
	 
	  // cast a ray through the frustum
	  this.raycaster.setFromCamera(normalizedPosition, camera);
	  // get the list of objects the ray intersected
	  const intersectedObjects = this.raycaster.intersectObjects(model.children);
	  if (intersectedObjects.length) {
		
		// pick the first object. It's the closest one
		this.pickedObject = intersectedObjects[0].object;
		// save its color
		this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
		// set its emissive color to flashing red/yellow
		//this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
		if(this.pickedObject.name == "next_btn"){
			this.pickedObject.material.emissive.setHex(0x00FF00)
		}

		if(this.pickedObject.name == "linkedin_box"){
			model.traverse((child)=>{
				if(child.name == "linkedin_logo"){
				child.parent.scale.lerp(new THREE.Vector3(1.2,1.2,1.2),0.3)
				} 	
			})
		}else{
			model.traverse((child)=>{
				if(child.name == "linkedin_logo"){
				child.parent.scale.set(1,1,1)
				} 	
			})
	
		} 

		if(this.pickedObject.name == "github_box"){
			model.traverse((child)=>{
				if(child.name == "github_icon"){
				child.scale.lerp(new THREE.Vector3(1.2,1.2,1.2),0.3)
				} 	
			})
		}else{
			model.traverse((child)=>{
				if(child.name == "github_icon"){
				child.scale.set(1,1,1)
				} 	
			})
	
		} 

		if(this.pickedObject.name == "mail_box"){
			model.traverse((child)=>{
				if(child.name == "mail_icon"){
				child.scale.lerp(new THREE.Vector3(1.2,1.2,1.2),0.3)
				} 	
			})
		}else{
			model.traverse((child)=>{
				if(child.name == "mail_icon"){
				child.scale.set(1,1,1)
				} 	
			})
	
		} 
	  }
	}
  }

  const pickPosition = {x: 0, y: 0};
  clearPickPosition();
/*
  function getCanvasRelativePosition(event) {
	const rect = container.getBoundingClientRect();
	return {
	  x: (event.clientX - rect.left) * window.innerWidth   / rect.width,
	  y: (event.clientY - rect.top ) * window.innerHeight  / rect.height,
	};
  }
  */ 
  function setPickPosition(event) {
	//const pos = getCanvasRelativePosition(event);
	const rect = container.getBoundingClientRect();
	//console.log(pos)
	//pickPosition.x = (pos.x / window.innerWidth ) *  2 - 1;
	//pickPosition.y = (pos.y / window.innerHeight ) * -2 + 1;  // note we flip Y
	pickPosition.x = (rect.left/2 ) //*  2 - 1;
	pickPosition.y = (rect.top/2 ) //* -2 + 1;  // note we flip Y
	//console.log(pickPosition)
  }
   
  function clearPickPosition() {
	// unlike the mouse which always has a position
	// if the user stops touching the screen we want
	// to stop picking. For now we just pick a value
	// unlikely to pick something
	flag=false
	pickPosition.x = -100000;
	pickPosition.y = -100000;
  }
   
  window.addEventListener('mousemove', setPickPosition);
  window.addEventListener('mouseout', clearPickPosition);
  window.addEventListener('mouseleave', clearPickPosition);

  window.addEventListener('touchstart', (event) => {
	// prevent the window from scrolling
	event.preventDefault();
	setPickPosition(event.touches[0]);
  }, {passive: false});
   
  window.addEventListener('touchmove', (event) => {
	setPickPosition(event.touches[0]);
  });
   
  window.addEventListener('touchend', clearPickPosition);

  const pickHelper = new PickHelper();

const clickFunction = (e) =>{
	//CINEMA SCREEN NEXT IMAGE BUTTON FUNCTION
	if(pickHelper.pickedObject.name == "next_btn"){

		model.traverse((child)=>{
			if(child.name == "cinema_screen"){
				
				const id = child.material.map.uuid
				const array = materials.map((img)=>img.map.uuid)
				const index = array.indexOf(id)

				if(index<array.length-1){
					child.material.map = materials[index+1].map
					child.material.map.wrapS = THREE.RepeatWrapping;
					child.material.map.wrapT = THREE.RepeatWrapping;
					child.material.map.rotation = Math.PI/2
				}else{
					child.material.map = materials[0].map
					child.material.map.wrapS = THREE.RepeatWrapping;
					child.material.map.wrapT = THREE.RepeatWrapping;
					child.material.map.rotation = Math.PI/2
				}
			} 	
		})
			}

	if(pickHelper.pickedObject.name == "linkedin_box"){
		if(flag){
			window.open('https://www.linkedin.com/in/nnuccelli/','_blank')
		}	
	}
	
	if(pickHelper.pickedObject.name == "github_box"){
		if(flag){
			window.open('https://github.com/nnfromthewindow','_blank')
		}
	}

	if(pickHelper.pickedObject.name == "mail_box"){
		if(flag){
			window.open('mailto:nuccelli@hotmail.com','_blank')
		}
	}	
}

  window.addEventListener('click', clickFunction)
  


	//-----------------ANIMATE FUNCTION--------------------------------

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
				pickHelper.pick(pickPosition, scene, camera, deltaTime);

				renderer.render( scene, camera );

				requestAnimationFrame( animate );

			}

			animate();