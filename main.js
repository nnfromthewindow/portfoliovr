import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Octree } from 'three/addons/math/Octree.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';
import { Capsule } from 'three/addons/math/Capsule.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { TextureLoader } from 'three';
import nipplejs from 'nipplejs';

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




const container = document.getElementById('container');
const initScreen = document.getElementById('init-screen');
const pointerlock = document.getElementById('pointerlock');
const touchScreen = document.getElementById('touch-screen');
const jump = document.getElementById('jump');

var options = {
	zone: document.getElementById('zone_joystick'),
	mode: 'static',
	position: {left: '30%', top: '0%'},
	color: 'red'
};

let portrait = window.matchMedia("(orientation: portrait)");



portrait.addEventListener("change", function(e) {
    if(e.matches) {
       console.log("PORTRAIT")
	   if(window.mobileCheck()){
		renderer.setPixelRatio(0.5)

	}
    } else {
        console.log("LANDSCAPE")
		if(window.mobileCheck()){
			renderer.setPixelRatio(0.8)
		
		}
    }
})

window.mobileCheck = function() {
	let check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
  };

  console.log(window.mobileCheck())

if(portrait.matches) {
	options.position.top = '82%'
	options.position.left = '30%'
}else{
	options.position.top = '69%'
	options.position.left = '15%'
}

var joystickManager = nipplejs.create(options);

console.log(joystickManager)

if(!window.mobileCheck()){
	touchScreen.style.display='none'
}


pointerlock.addEventListener('click', ()=>{
	flag=false
	flag2=true
		document.body.requestPointerLock();

		mouseTime = performance.now();		
		//pointerlock.style.display='none'
	setTimeout(()=>{
	if(!window.mobileCheck()){
	flag =true
	initScreen.style.display='none'
	}	

	
	},1000)
})


const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
container.appendChild( renderer.domElement );

if(portrait.matches){
	renderer.setPixelRatio(0.5)
}else if(!portrait && window.innerWidth<1024){
	renderer.setPixelRatio(0.8)
}


const GRAVITY = 30;

const STEPS_PER_FRAME = 5;


const worldOctree = new Octree();

const playerCollider = new Capsule( new THREE.Vector3( 3, 0.35, 0 ), new THREE.Vector3( 3, 1.8, 0 ), 0.35 );

const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();


let playerOnFloor = false;
let mouseTime = 0;
let flag = false;
let flag2 = false
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

/*
container.addEventListener( 'mousedown', (e) => {
	flag=false
	
		document.body.requestPointerLock();

		mouseTime = performance.now();		
	
	setTimeout(()=>{
	flag =true
	initScreen.style.display='none'
	},1000)
} );
*/



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
				if(!window.mobileCheck()){
					pointerlock.style.display='block'
					initScreen.style.display='flex'
					touchScreen.style.display='none'
				}else{
					pointerlock.style.display='none'
					initScreen.style.display='none'
					touchScreen.style.display='flex'
					if(!portrait){
				
						console.log("port_resize:")
						
						//joystick.options.position = { left: '30%', top: '82%' }; 
					}else{
				
						console.log("land_resize:")
					
						//joystick.options.position = { left: '15%', top: '69%' };
					}

				}
				
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

///////////////////////TOUCH CONTROLS///////////////////////////

let touchPosition = {x:0,y:0}

joystickManager.on('move',(e)=>{
	touchPosition.x = e.target.nipples[0].frontPosition.x
	touchPosition.y = e.target.nipples[0].frontPosition.y
})

joystickManager.on('end',(e)=>{
	touchPosition.x = 0
	touchPosition.y = 0
})

jump.addEventListener('touchstart', (e)=>{

	if ( playerOnFloor ) {



			playerVelocity.y = 10;

		

	}
})

const touchControls = (deltaTime) =>{

				// gives a bit of air control
				const speedDelta = deltaTime * ( playerOnFloor ? 25 : 8 );

				if ( touchPosition.y < 0 && touchPosition.y > -50 ) {

					playerVelocity.add( getForwardVector().multiplyScalar( speedDelta ) );

				}

				if ( touchPosition.y > 0 && touchPosition.y < 50 ) {

					playerVelocity.add( getForwardVector().multiplyScalar( - speedDelta ) );

				}

				if (touchPosition.x < 0 && touchPosition.x > -50 ) {

					playerVelocity.add( getSideVector().multiplyScalar( - speedDelta ) );

				}

				if ( touchPosition.x > 0 && touchPosition.x < 50 ) {

					playerVelocity.add( getSideVector().multiplyScalar( speedDelta ) );

				}


				if ( playerOnFloor ) {

					if ( keyStates[ 'Space' ] ) {

						playerVelocity.y = 10;

					}

				}


}





/////////////////////////////////////////////////////////////////


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
			 
			//console.log(gltfData.scene.children)
			
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
  //clearPickPosition();
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
	flag2=false
	if(!window.mobileCheck()){
		initScreen.style.display='flex'
	}else{
		initScreen.style.display='none'
	}
	
	pickPosition.x = -100000;
	pickPosition.y = -100000;
	//pointerlock.style.display='block'
  }
   
	window.addEventListener('mousemove', setPickPosition);
	window.addEventListener('mouseout', clearPickPosition);
	window.addEventListener('mouseleave', clearPickPosition);

//////////POINTER LOCK ENTER/EXIT //////////////////

	document.addEventListener('pointerlockchange', (e)=>{
	
	if(flag2){
		pointerlock.style.display='none'
	}else if(!flag2){
		setTimeout(()=>{
			pointerlock.style.display='block'
		},2000)
		
	}
	flag = !flag
})
//////////////////////


  window.addEventListener('touchstart', (event) => {
	// prevent the window from scrolling
	event.preventDefault();
	setPickPosition(event.touches[0]);
  }, {passive: false});
   
  window.addEventListener('touchmove', (event) => {
	
	setPickPosition(event.touches[0]);
  });
   
  window.addEventListener('touchend', clearPickPosition);

  window.addEventListener('pointermove', (event) => {
	if(window.mobileCheck() && touchPosition.y==0){
		camera.rotation.y -= event.movementX / 500;
		camera.rotation.x -= event.movementY / 500;
	  
	}
	});

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
					touchControls(deltaTime)
					updatePlayer( deltaTime );


					teleportPlayerIfOob();

				}

				mixer.update(deltaTime)
				pickHelper.pick(pickPosition, scene, camera, deltaTime);

				renderer.render( scene, camera );

				requestAnimationFrame( animate );

			}

			animate();