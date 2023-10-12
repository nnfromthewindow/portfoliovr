import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Octree } from 'three/addons/math/Octree.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';
import { Capsule } from 'three/addons/math/Capsule.js';
import { TextureLoader,LoadingManager } from 'three';
import nipplejs from 'nipplejs';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { fetchProfile, MotionController } from '@webxr-input-profiles/motion-controllers'
import { Constants } from '@webxr-input-profiles/motion-controllers';

//MOBILE CHECK FUNCTION
window.mobileCheck = function() {
	let check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
  };

//MODEL LOADER
const loadManager = new LoadingManager();
const imageLoader = new TextureLoader(loadManager);
const gltfLoader = new GLTFLoader(loadManager);

let model, mixer, animations, joystickManager;

gltfLoader.load('./assets/blender_test.gltf', function(gltf) {
	model = gltf.scene;
	animations = gltf.animations

	
	
	//DESKTOP CHECK
	if(!window.mobileCheck()){
		crosshair.style.display='block'
		touchScreen.style.display='none'
		initScreen.style.display='flex'
		jump.style.display='none'
		renderer.setPixelRatio( window.devicePixelRatio )
	}
	if(window.mobileCheck()){
		crosshair.style.display='none'
		touchScreen.style.display='flex'
		initScreen.style.display='none'
		jump.style.display='flex'
	}
	
	//NIPPLE.JS OPTIONS
var options = {
	zone: document.getElementById('zone_joystick'),
	mode: 'static',
	position: {left: '30%', top: '0%'},
	color: 'red'
};
worldOctree.fromGraphNode(model);
scene.add(model);
});

let materials

//LOAD MANAGER ON LOAD FUNCTION
loadManager.onLoad = function() {

	//ANIMATION MIXER
	mixer = new THREE.AnimationMixer(model );
	mixer.clipAction(animations[ 1 ] ).play();
	mixer.clipAction(animations[ 2 ] ).play();
	//MODEL TRAVERSE
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
		//MODEL BOUNDARY
		if(child.name == "boundary"){
			child.visible = false
		}
		//MODEL LIGHTS
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
		//CAST SHADOWS
		if ( child.isMesh ) {
			child.castShadow = true;
			child.receiveShadow = true;
		}
		//CONTACT LINKS MESH
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
	
	console.log(model.children)
	progressBarContainer.style.display = 'none';

	
	//CREATE JOYSTICK
	joystickManager = nipplejs.create(options);

	joystickManager.on('move',(e)=>{
		touchPosition.x = e.target.nipples[0].frontPosition.x
		touchPosition.y = e.target.nipples[0].frontPosition.y
	})

	joystickManager.on('end',(e)=>{
		touchPosition.x = 0
		touchPosition.y = 0
	})

	materials = [
		new THREE.MeshBasicMaterial({map: imageLoader.load('assets/frente.jpg')}),
		new THREE.MeshBasicMaterial({map: imageLoader.load('assets/interior.jpg')}),
		new THREE.MeshBasicMaterial({map: imageLoader.load('assets/barra.jpg')}),
				
	]

}

//LOADING BAR

loadManager.onProgress = function(url, loaded, total) {
    progressBar.value = (loaded / total) * 100;
	crosshair.style.display='none'
}

const progressBarContainer = document.querySelector('.progress-bar-container');


//DOM VARIABLES
const container = document.getElementById('container');
const crosshair = document.getElementById('crosshair');
const initScreen = document.getElementById('init-screen');
const pointerlock = document.getElementById('pointerlock');
const touchScreen = document.getElementById('touch-screen');
const jump = document.getElementById('jump');
const progressBar = document.getElementById('progress-bar');


//THREE.JS VARIABLES
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.rotation.order = 'YXZ';
let playerCollider;
let portrait = window.matchMedia("(orientation: portrait)");
//scene.background = new THREE.Color( 0x88ccee );
//scene.fog = new THREE.Fog( 0x88ccee, 0, 50 );

//HIDE CONTROLS
initScreen.style.display='none'
touchScreen.style.display='none'
jump.style.display='none'


//NIPPLE.JS OPTIONS
var options = {
	zone: document.getElementById('zone_joystick'),
	mode: 'static',
	position: {left: '30%', top: '0%'},
	color: 'red'
};

//PORTRAIT ORIENTATION CHECK
portrait.addEventListener("change", function(e) {
    if(e.matches) {
	   if(window.mobileCheck()){
		renderer.setPixelRatio(0.5)
	}
    } else {
		if(window.mobileCheck()){
			renderer.setPixelRatio(0.8)
		}
    }
})

if(portrait.matches) {
	options.position.top = '82%'
	options.position.left = '30%'
	camera.rotation.set(0,-10.4,0)
	playerCollider = new Capsule( new THREE.Vector3( 4.8, 0.35, -1 ), new THREE.Vector3( 4.8, 1.8, -1 ), 0.35 );
}else{
	options.position.top = '69%'
	options.position.left = '15%'
	camera.rotation.set( 0, -80.11, 0 );
	playerCollider = new Capsule( new THREE.Vector3( 3, 0.35, 0 ), new THREE.Vector3( 3, 1.8, 0 ), 0.35 );
}





//DESKTOP POINTERLOCK
pointerlock.addEventListener('click', ()=>{
	if(crosshair.style.display='none'){
		crosshair.style.display='block'
	}
	flag=false
	flag2=true
		document.body.requestPointerLock();

		mouseTime = performance.now();		
	
	setTimeout(()=>{
	if(!window.mobileCheck()){
	flag =true
	initScreen.style.display='none'
	}		
	},1000)
})

//SET RENDERER
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.xr.enabled = true;
renderer.xr.setFramebufferScaleFactor(2.0);
document.body.appendChild( VRButton.createButton( renderer ) );
container.appendChild( renderer.domElement );

//VR BUTTON
const vrButton = document.getElementById('VRButton');

vrButton.addEventListener('touchstart', (e)=>{
	vrButton.click()
})

let xrSession

renderer.xr.addEventListener( 'sessionstart', () =>{ 
	baseReferenceSpace = renderer.xr.getReferenceSpace() 
	//animationFrameRequestID = renderer.xr.getFrame()
	xrSession = renderer.xr.getSession()
	xrSession.addEventListener('inputsourceschange', onInputSourcesChange);
});

function onInputSourcesChange(event) {
	event.added.forEach((xrInputSource) => {
		console.log(xrInputSource)
	  createMotionController(xrInputSource);
	});
  };

  const uri = 'node_modules/@webxr-input-profiles/assets/dist/profiles';
  const motionControllers = {};
  
  async function createMotionController(xrInputSource) {
	const { profile, assetPath } = await fetchProfile(xrInputSource, uri);
	const motionController = new MotionController(xrInputSource, profile, assetPath);
	motionControllers[xrInputSource] = motionController;
	addMotionControllerToScene(motionController);
  }  


  function processTriggerInput(trigger) {
	if (trigger.state === Constants.ComponentState.PRESSED) {
	  // Fire ray gun
	} else if (trigger.state === Constants.ComponentState.TOUCHED) {
	  const chargeLevel = trigger.buttonValue;
	  // Show ray gun charging up
	}
  }

  function processThumbstickInput(thumbstick) {
	if (thumbstick.values.state === Constants.ComponentState.PRESSED) {
	  // Align the world orientation to the user's current orientation
	} else if (thumbstick.values.state === Constants.ComponentState.TOUCHED
			   && thumbstick.values.yAxis !== 0) {
	  const scootDistance = thumbstick.values.yAxis * scootIncrement;
	  // Scoot the user forward
	}
  }

   function addMotionControllerToScene(motionController) {
	
	gltfLoader.load(motionController.assetUrl, function(gltf){
		console.log(gltf)
		const model = gltf.scene
		console.log(model)
		addTouchPointDots(motionController, model);
		scene.add(model);
	});
	
	//console.log(motionController.assetUrl)
	
  }

  function addTouchPointDots(motionController, asset) {
	Object.values(motionController.components).forEach((component) => {
	  if (component.touchPointNodeName) {
		const touchPointRoot = asset.getChildByName(component.touchPointNodeName, true);
		
		const sphereGeometry = new THREE.SphereGeometry(0.001);
		const material = new THREE.MeshBasicMaterial({ color: 0x0000FF });
		const touchPointDot = new THREE.Mesh(sphereGeometry, material);
		touchPointRoot.add(touchPointDot);
	  }
	});
  }

  

renderer.xr.addEventListener('sessionend',()=>{
	camera.rotation.set(0,-10.4,0)
	camera.fov=70
	camera.aspect=window.innerWidth / window.innerHeight
	camera.near=0.1
	camera.far=1000
 })
 
 let raycaster;
 let controller1, controller2;
 let controllerGrip1, controllerGrip2;

 let marker, baseReferenceSpace, animationFrameRequestID;
/*
 let INTERSECTION;
 const tempMatrix = new THREE.Matrix4();

marker = new THREE.Mesh(
	new THREE.CircleGeometry( 0.25, 32 ).rotateX( - Math.PI / 2 ),
	new THREE.MeshBasicMaterial( { color: 0xbcbcbc } )
);
scene.add( marker );

raycaster = new THREE.Raycaster();								





let dolly = new THREE.Object3D()
dolly.position.z=5
dolly.add(camera)
dolly.add(playerCollider)
scene.add(dolly)

let dummyCam = new THREE.Object3D()
camera.add(dummyCam)
*/
// controllers
/*
	function onSelectStart() {

		this.userData.isSelecting = true;

	}

	function onSelectEnd() {

		this.userData.isSelecting = false;

		if ( INTERSECTION ) {

			const offsetPosition = { x: - INTERSECTION.x, y: - INTERSECTION.y, z: - INTERSECTION.z, w: 1 };
			const offsetRotation = new THREE.Quaternion();
			const transform = new XRRigidTransform( offsetPosition, offsetRotation );
			const teleportSpaceOffset = baseReferenceSpace.getOffsetReferenceSpace( transform );
			renderer.xr.setReferenceSpace( teleportSpaceOffset );

		}

	}
	let leftStickPosition = [0,0,0,0];
	let rightStickPosition = [0,0,0,0];
	let leftJumpButton
	let rightJumpButton
	controller1 = renderer.xr.getController( 0 );
	controller1.addEventListener( 'selectstart', onSelectStart );
	controller1.addEventListener( 'selectend', onSelectEnd );
	controller1.addEventListener( 'connected', function ( e ) {
		rightStickPosition = e.data.gamepad.axes
		rightJumpButton = e.data.gamepad.buttons
		this.add( buildController( e.data ) );
	} );
	

	controller1.addEventListener( 'disconnected', function () {

		this.remove( this.children[ 0 ] );

	} );
	scene.add( controller1 );
//	dolly.add( controller1 );
	controller2 = renderer.xr.getController( 1 );
	controller2.addEventListener( 'selectstart', onSelectStart );
	controller2.addEventListener( 'selectend', onSelectEnd );
	controller2.addEventListener( 'connected', function ( e ) {
		leftStickPosition = e.data.gamepad.axes
		this.add( buildController( e.data ) );

	} );
	controller2.addEventListener( 'disconnected', function () {

		this.remove( this.children[ 0 ] );

	} );
	scene.add( controller2 );
//	dolly.add( controller2 );
	// The XRControllerModelFactory will automatically fetch controller models
	// that match what the user is holding as closely as possible. The models
	// should be attached to the object returned from getControllerGrip in
	// order to match the orientation of the held device.

	const controllerModelFactory = new XRControllerModelFactory();

	controllerGrip1 = renderer.xr.getControllerGrip( 0 );
	controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
	scene.add( controllerGrip1 );
//	dolly.add(controllerGrip1)
	controllerGrip2 = renderer.xr.getControllerGrip( 1 );
	controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
	scene.add( controllerGrip2 );
//	dolly.add(controllerGrip2)
	//

	window.addEventListener( 'resize', onWindowResize, false );



function buildController( data ) {

	let geometry, material;

	switch ( data.targetRayMode ) {

		case 'tracked-pointer':

			geometry = new THREE.BufferGeometry();
			geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
			geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );

			material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );

			return new THREE.Line( geometry, material );

		case 'gaze':

			geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
			material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
			return new THREE.Mesh( geometry, material );

	}

}

*/

//SET PIXEL RATIO
if(portrait.matches){
	renderer.setPixelRatio(0.5)
}else if(!portrait && window.mobileCheck()){
	renderer.setPixelRatio(0.8)
}

//PHYSICS VARIABLES
const GRAVITY = 30;
const STEPS_PER_FRAME = 5;
const worldOctree = new Octree();
const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();
let playerOnFloor = false;
let mouseTime = 0;
let flag = false;
let flag2 = false
const keyStates = {};

//POSITION VARIABLES 
const touchPosition = {x:0,y:0}
const touchStartPosition = {x:0,y:0}
const pickPosition = {x: 0, y: 0};

//KEYS EVENT LISTENERS
document.addEventListener( 'keydown', ( event ) => {

	keyStates[ event.code ] = true;

} );

document.addEventListener( 'keyup', ( event ) => {

	keyStates[ event.code ] = false;

} );

//MOUSE EVENT LISTENERS
document.body.addEventListener( 'mousemove', ( event ) => {

	if ( document.pointerLockElement === document.body ) {
		camera.rotation.y -= event.movementX / 500;
		camera.rotation.x -= event.movementY / 500;
	}
} );

//WINDOW RESIZE FUNCTION
window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {
	
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	
	renderer.setSize( window.innerWidth, window.innerHeight );
	if(!window.mobileCheck()){
		crosshair.style.display='block'
		pointerlock.style.display='block'
		initScreen.style.display='flex'
		touchScreen.style.display='none'
		jump.style.display='none'
		renderer.setPixelRatio( window.devicePixelRatio );
	}else{
		crosshair.style.display='none'
		pointerlock.style.display='none'
		initScreen.style.display='none'
		touchScreen.style.display='flex'
		jump.style.display='flex'
	}
	
}

//PHYSICS FUNCTIONS

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

function teleportPlayerIfOob() {

	if ( camera.position.y <= - 25 ) {

		playerCollider.start.set( 0, 0.35, 0 );
		playerCollider.end.set( 0, 1, 0 );
		playerCollider.radius = 0.35;
		camera.position.copy( playerCollider.end );
		camera.rotation.set( 0, 0, 0 );

	}

}

//KEYBOARD CONTROLS
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
//console.log(camera.position)
}

//TOUCH CONTROLS

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

//VR CONTROLS
/*
function vrControls( deltaTime ) {
// gives a bit of air control
const speedDelta = deltaTime * ( playerOnFloor ? 25 : 8 );
console.log()
if ( rightStickPosition[3]>=-1 && rightStickPosition[3]<0) {

	playerVelocity.add( getForwardVector().multiplyScalar( speedDelta ) );

	const speed = 2
	const quaternion = dolly.quaternion.clone()
	dolly.quaternion.copy(camera.quaternion)
	dolly.translateZ(-deltaTime*speed)
	dolly.position.y =0
	dolly.quaternion.copy(quaternion)


}
/*
if ( rightStickPosition[3]<=1 && rightStickPosition[3]>0) {

	playerVelocity.add( getForwardVector().multiplyScalar( -speedDelta ) );
	//console.log(camera.position)
	//console.log(renderer.xr.getCamera().position)		
}
*/

/*	
const speedMultiplier = playerOnFloor ? 900 : 500;
const gravity = -700; // Ajusta la gravedad según tus necesidades

const movement = new THREE.Vector3();

movement.add(getForwardVector().multiplyScalar(-rightStickPosition[3] * deltaTime * speedMultiplier));
movement.add(getSideVector().multiplyScalar(rightStickPosition[2] * deltaTime * speedMultiplier));

movement.add(getForwardVector().multiplyScalar(-leftStickPosition[3] * deltaTime * speedMultiplier));
movement.add(getSideVector().multiplyScalar(leftStickPosition[2] * deltaTime * speedMultiplier));

// Aplica el movimiento a la velocidad del jugador
playerVelocity.copy(movement);

if (playerOnFloor) {
	if (rightJumpButton[4].pressed) {
		// Aplica una aceleración inicial hacia arriba
		playerVelocity.y = 10;
	} 
}

// Establece el espacio de referencia solo una vez al final
const offsetPosition = camera.position.add(new THREE.Vector3(0, -2.02, 0)).negate();
const offsetRotation = new THREE.Quaternion();
const transform = new XRRigidTransform(offsetPosition, offsetRotation);
const teleportSpaceOffset = baseReferenceSpace.getOffsetReferenceSpace(transform);
renderer.xr.setReferenceSpace(teleportSpaceOffset);
//console.log(camera.position)
//console.log(renderer.xr.getCamera().position)

}
	
	
*/




//SCENE ADD MODEL
//scene.add(model);

//ADD PHYSICS




//OCTREE HELPER
const helper = new OctreeHelper( worldOctree );
helper.visible = false;
scene.add( helper );



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


//SET POSITION FUNCTIONS

function getCanvasRelativePosition(event) {
const rect = container.getBoundingClientRect();
return {
	x: (event.clientX - rect.left) * window.innerWidth   / rect.width,
	y: (event.clientY - rect.top ) * window.innerHeight  / rect.height,
};
}

function setPickPosition(event) {
const rect = container.getBoundingClientRect();
pickPosition.x = (rect.left/2 ) 
pickPosition.y = (rect.top/2 )
}

function setTouchPosition(event) {
const pos = getCanvasRelativePosition(event);
touchStartPosition.x = (pos.x / window.innerWidth ) *  2 - 1;
touchStartPosition.y = (pos.y / window.innerHeight ) * -2 + 1;  // note we flip Y
}

function clearPickPosition() {
// unlike the mouse which always has a position
// if the user stops touching the screen we want
// to stop picking. For now we just pick a value
// unlikely to pick something
if(!flag)crosshair.style.display='none'
flag=false
flag2=false

if(!window.mobileCheck()){
	initScreen.style.display='flex'
}else{
	initScreen.style.display='none'
}
pickPosition.x = -100000;
pickPosition.y = -100000;
}

window.addEventListener('mousemove', setPickPosition);
window.addEventListener('mouseout', clearPickPosition);
window.addEventListener('mouseleave', clearPickPosition);
window.addEventListener('touchstart', (event) => {
	// prevent the window from scrolling
	event.preventDefault();
	//setPickPosition(event.touches[0]);
	setTouchPosition(event.touches[0]);
	flag=true
	clickFunction()
  }, {passive: false});
   
  window.addEventListener('touchmove', (event) => {
	//setPickPosition(event.touches[0]);
	setTouchPosition(event.touches[0]);
  });
   
  window.addEventListener('touchend', clearPickPosition);

  window.addEventListener('pointermove', (event) => {
	if(window.mobileCheck() && touchPosition.y==0){
		camera.rotation.y -= event.movementX / 500;
		camera.rotation.x -= event.movementY / 500;
	  
	}
	});

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

//CLICK FUNCTION
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
//console.log(leftStickPosition)
//console.log(rightStickPosition)
const deltaTime = Math.min( 0.05, clock.getDelta() ) / STEPS_PER_FRAME;

// we look for collisions in substeps to mitigate the risk of
// an object traversing another too quickly for detection.

for ( let i = 0; i < STEPS_PER_FRAME; i ++ ) {

	if(!renderer.xr.isPresenting){
		controls( deltaTime );
		touchControls(deltaTime)
	}

//if(renderer.xr.isPresenting)vrControls(deltaTime)

if(model)updatePlayer( deltaTime );

teleportPlayerIfOob();

}

if(mixer)mixer.update(deltaTime)
if(window.mobileCheck()){
if(model)pickHelper.pick(touchStartPosition, scene, camera, deltaTime);

}else{
	if(model)pickHelper.pick(pickPosition, scene, camera, deltaTime);

}

/*
INTERSECTION = undefined;

if ( controller1.userData.isSelecting === true ) {

	tempMatrix.identity().extractRotation( controller1.matrixWorld );

	raycaster.ray.origin.setFromMatrixPosition( controller1.matrixWorld );
	raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );
	const intersects = raycaster.intersectObjects( [ model.children[138] ] );

	if ( intersects.length > 0 ) {

		INTERSECTION = intersects[ 0 ].point;

	}

} else if ( controller2.userData.isSelecting === true ) {

	tempMatrix.identity().extractRotation( controller2.matrixWorld );

	raycaster.ray.origin.setFromMatrixPosition( controller2.matrixWorld );
	raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );

	const intersects = raycaster.intersectObjects( [  model.children[138] ] );

	if ( intersects.length > 0 ) {

		INTERSECTION = intersects[ 0 ].point;

	}

}

if ( INTERSECTION ) marker.position.copy( INTERSECTION );
marker.position.add(new THREE.Vector3(0, 0.1, 0))
marker.visible = INTERSECTION !== undefined;


*/

renderer.render( scene, camera );
if(renderer.xr.isPresenting && motionControllers){
	
	Object.values(motionControllers).forEach((motionController) =>{
		console.log(motionController)
		motionController.updateFromGamepad()
		updateMotionControllerModel(motionController);	
		});
		
}

//requestAnimationFrame( animate );

}

renderer.setAnimationLoop(animate)


function updateMotionControllerModel(motionController) {
console.log(scene)
	// Update the 3D model to reflect the button, thumbstick, and touchpad state
	//console.log(motionController)
//	const motionControllerRoot = scene.getObjectByName('root');
	console.log(motionControllerRoot)
	//console.log(motionController)
	//console.log(motionController.layoutDescription.rootNodeName)
	Object.values(motionController.components).forEach((component) => {
console.log(component)
		component.visualResponses.forEach((visualResponse) => {
		// Find the topmost node in the visualization
		const valueNode = motionControllerRoot.getChildByName(visualResponse.valueNodeName);
  
		// Calculate the new properties based on the weight supplied
		if (visualResponse.valueNodeProperty === 'visibility') {
		  valueNode.visible = visualResponse.value;
		} else if (visualResponse.valueNodeProperty === 'transform') {
		  const minNode = motionControllerRoot.getObjectByName(visualResponse.minNodeName);
		  const maxNode = motionControllerRoot.getObjectByName(visualResponse.maxNodeName);
  
		  THREE.Quaternion.slerp(
			minNode.quaternion,
			maxNode.quaternion,
			valueNode.quaternion,
			visualResponse.value
		  );
  
		  valueNode.position.lerpVectors(
			minNode.position,
			maxNode.position,
			visualResponse.value
		  );
		}
	  });
	});
  }
//animate();