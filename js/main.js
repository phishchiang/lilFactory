
let camera, scene, renderer;
let isCarMoving = false;
let snowPartiArray;
let mixers = [];
let clock = new THREE.Clock();
let time = 0;
let carGroup = new THREE.Group();
let facGroup = new THREE.Group();
let treeGroup = new THREE.Group();
let gateGroup = new THREE.Group();
let gateBtnGroup = new THREE.Group();
let innerGroup = new THREE.Group();
let envGroup = new THREE.Group();
let infoCardFactoryGrp = new THREE.Group();
let infoCardCarGrp = new THREE.Group();
let cardFacOn = false;
let cardCarOn = false;
let facIsTransparent = false;
let dirLight;
let sky
let carWorldPosition;


let mouse, raycaster;
raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();
let intersectObjs = [];

carAudio = new Audio('./resource/sound/horn.mp3'); 
/*
engineAudio = new Audio('./resource/sound/Engine.mp3'); 
engineAudio.addEventListener('ended', function(){
  this.currentTime = 0;
  this.play();
}, false);
engineAudio.play();
*/

init();
animate();


function init(){
  scene = new THREE.Scene();

  scene.background = new THREE.Color(0x454545);
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  renderer.gammaInput = true;
  renderer.gammaOutput = true;





  
  /*
  let geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
  let loader = new THREE.TextureLoader();
  // let textureMapCube = loader.load( 'models/fbx/img/maps.jpg' );
  // let material = new THREE.MeshPhongMaterial( {color: 0x00ff00, map: textureMapCube} );
  let material = new THREE.MeshPhongMaterial( {color: 0xeeeeee} );
  let threeJsCube = new THREE.Mesh( geometry, material );
  threeJsCube.position.x = -3.25;
  threeJsCube.scale.set(0.5, 0.5, 0.5);
  
  let floorGeo = new THREE.PlaneBufferGeometry( 10,10 );
  let floorMesh = new THREE.Mesh( floorGeo, material );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.y = 0;
  scene.add( floorMesh );
  */
  /*
  let amibLight = new THREE.AmbientLight( 0xFFFFFF, 0.2 );
  amibLight.position.set( 3,3,3 );
  scene.add( amibLight );
  */
  // LIGHTS

  hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
  hemiLight.color.setHSL( 0.6, 1, 0.6 );
  // hemiKolor = new THREE.Color( 0x9fc2f9 );
  hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
  hemiLight.position.set( 0, 50, 0 );
  scene.add( hemiLight );

  // hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
  // scene.add( hemiLightHelper );

  
  // DirLight
  dirLight = new THREE.DirectionalLight( 0xffffff,  1.2 );
  dirLight.color.setHSL( 0.1, 1, 0.95 );
  dirLight.position.set( 1, 1.75, 1 );
  dirLight.position.multiplyScalar( 30 );
  scene.add( dirLight );
  // dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 );
  // scene.add( dirLightHeper );

  dirLight.castShadow = true;
  

  // Controller
  // camera.position.z=3;
  let controls = new THREE.OrbitControls(camera, renderer.domElement)
  // camera.position.z = 15
  // camera.position.y = 1
  camera.position.set( 12.75, 8, 14 );
  controls.update()
  
  
  //FBX import
  let loader = new THREE.FBXLoader();

  // Car
  
  scene.add( carGroup );
  loader.load( './resource/models/fbx/car.fbx', function ( fbx ) {
    fbx.mixer = new THREE.AnimationMixer( fbx );
    let mesh = fbx.children[0];
    mesh.material = new THREE.MeshPhongMaterial({vertexColors: THREE.VertexColors});

    fbx.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
        intersectObjs.push(child);
      }
    });
    console.log(fbx);
    carGroup.add( fbx );
  });
  carGroup.rotation.set(0, -90*Math.PI/180, 0);
  carGroup.position.set(5,0,10);

  // Env
  
  scene.add( envGroup );
  loader.load( './resource/models/fbx/env.fbx', function ( fbx ) {
    fbx.mixer = new THREE.AnimationMixer( fbx );
    let mesh = fbx.children[0];
    mesh.material = new THREE.MeshPhongMaterial({vertexColors: THREE.VertexColors});

    fbx.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
        intersectObjs.push(child);
      }
    });
    console.log(fbx);
    envGroup.add( fbx );
  });

  // Fac
  
  scene.add( facGroup );
  loader.load( './resource/models/fbx/factory.fbx', function ( fbx ) {
    fbx.mixer = new THREE.AnimationMixer( fbx );
    let mesh = fbx.children[0];
    mesh.material = new THREE.MeshPhongMaterial({vertexColors: THREE.VertexColors});

    fbx.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
        intersectObjs.push(child);
      }
    });
    console.log(fbx);
    facGroup.add( fbx );
  });

  // Inner
  
  scene.add( innerGroup );
  loader.load( './resource/models/fbx/inner.fbx', function ( fbx ) {
    fbx.mixer = new THREE.AnimationMixer( fbx );
    let mesh = fbx.children[0];
    mesh.material = new THREE.MeshPhongMaterial({vertexColors: THREE.VertexColors});

    fbx.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
        intersectObjs.push(child);
      }
    });
    console.log(fbx);
    innerGroup.add( fbx );
  });

  // Gate
  
  scene.add( gateGroup );
  loader.load( './resource/models/fbx/gate.fbx', function ( fbx ) {
    fbx.mixer = new THREE.AnimationMixer( fbx );
    let mesh = fbx.children[0];
    mesh.material = new THREE.MeshPhongMaterial({vertexColors: THREE.VertexColors});

    fbx.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
        intersectObjs.push(child);
      }
    });
    console.log(fbx);
    gateGroup.add( fbx );
  });

  // Gate Btn
  
  scene.add( gateBtnGroup );
  loader.load( './resource/models/fbx/gateBtn.fbx', function ( fbx ) {
    fbx.mixer = new THREE.AnimationMixer( fbx );
    let mesh = fbx.children[0];
    mesh.material = new THREE.MeshPhongMaterial({vertexColors: THREE.VertexColors});

    fbx.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
        intersectObjs.push(child);
      }
    });
    console.log(fbx);
    gateBtnGroup.add( fbx );
  });

  // Tree
  
  scene.add( treeGroup );
  loader.load( './resource/models/fbx/tree.fbx', function ( fbx ) {
    fbx.mixer = new THREE.AnimationMixer( fbx );
    let mesh = fbx.children[0];
    mesh.material = new THREE.MeshLambertMaterial({vertexColors: THREE.VertexColors});

    fbx.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
        intersectObjs.push(child);
      }
    });
    console.log(fbx);
    treeGroup.add( fbx );
  });
  
  // Factory card info
  let fontLloader = new THREE.FontLoader();
  fontLloader.load( './resource/fonts/Varela_Round_Regular.json', function ( font ) {
    let xMid, text;
    let color = 0x000000;

    let matLite = new THREE.MeshBasicMaterial( {
      color: color,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    let message = "Little Factory\nLocation : Singapore\nPhone : 111 1234-5678 ";
    let shapes = font.generateShapes( message, 0.75 );
    let geometry = new THREE.ShapeBufferGeometry( shapes );
    geometry.computeBoundingBox();
    xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
    geometry.translate( xMid, 0, 0 );
    text = new THREE.Mesh( geometry, matLite );
    infoCardFactoryGrp.add( text );
    text.position.z = 0.05;
  });
  
  let matFacCardBg = new THREE.MeshBasicMaterial({
    color: 0xeeeeee,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    });
  let cardFacGeo = new THREE.PlaneBufferGeometry( 13, 6 );
  let cardFacMesh = new THREE.Mesh( cardFacGeo, matFacCardBg );
  cardFacMesh.position.y = -1;
  infoCardFactoryGrp.add( cardFacMesh );

  scene.add( infoCardFactoryGrp );
  infoCardFactoryGrp.scale.set(0.5, 0.5, 0.5);
  infoCardFactoryGrp.position.set(0, 10, 0);


  


  // Car card info
  fontLloader.load( './resource/fonts/Varela_Round_Regular.json', function ( font ) {
    let xMid, text;
    let color = 0x000000;

    let matLite = new THREE.MeshBasicMaterial( {
      color: color,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    let message = "Little Car\nBrand : Tesla Semi\nType : Truck ";
    let shapes = font.generateShapes( message, 0.75 );
    let geometry = new THREE.ShapeBufferGeometry( shapes );
    geometry.computeBoundingBox();
    xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
    geometry.translate( xMid, 0, 0 );
    text = new THREE.Mesh( geometry, matLite );
    infoCardCarGrp.add( text );
    text.position.z = 0.05;
  });

  let matCarCardBg = new THREE.MeshBasicMaterial({
    color: 0xeeeeee,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  });
  let cardCarGeo = new THREE.PlaneBufferGeometry( 11, 6 );
  let cardCarMesh = new THREE.Mesh( cardCarGeo, matCarCardBg );
  cardCarMesh.position.y = -1;
  
  scene.add( infoCardCarGrp );
  infoCardCarGrp.add( cardCarMesh );
  infoCardCarGrp.rotation.y = Math.PI / 2;
  infoCardCarGrp.scale.set(0.35, 0.35, 0.35);
  // carGroup.add(infoCardCarGrp);
  infoCardCarGrp.position.set(0, 4, 0);
  
  scene.updateMatrixWorld(true);
  
  
  
  //add event listener for mouse and calls function when activated
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  // renderer.domElement.addEventListener('mousedown', mousedown);
  window.addEventListener( 'resize', onWindowResize, false );
}
// Factory show up animation
function showFacinfoCard (e){
  // console.log(e);
  if(!cardFacOn){
    cardFacOn = true;

    infoCardFactoryGrp.traverse( function (child) {
      if ( child.isMesh ) {
        // child.material.opacity = 0;
        let gone = new TWEEN.Tween( child.material )
          .to( { opacity: 0.5 }, 800 )
          .easing( TWEEN.Easing.Exponential.InOut )
          .onComplete(function(){
            let reset = new TWEEN.Tween( child.material )
              .to( { opacity: 0 }, 800 )
              .delay( 5000 )
              .easing( TWEEN.Easing.Exponential.InOut )
              .start();
          })
          .start();
      }
    });
    
  } else{
    cardFacOn = false;

    infoCardFactoryGrp.traverse( function (child) {
      if ( child.isMesh ) {
        // child.material.opacity = 0;
        let gone = new TWEEN.Tween( child.material )
          .to( { opacity: 0 }, 800 )
          .easing( TWEEN.Easing.Exponential.InOut )
          .start();
      }
    });
  }
}
// Car show up animation
function showCarinfoCard (e){
  carAudio.play();
  if(!cardCarOn){
    cardCarOn = true;
    infoCardCarGrp.traverse( function (child) {
      if ( child.isMesh ) {
        // child.material.opacity = 0;
        let gone = new TWEEN.Tween( child.material )
          .to( { opacity: 0.5 }, 800 )
          .easing( TWEEN.Easing.Exponential.InOut )
          .onComplete(function(){
            let reset = new TWEEN.Tween( child.material )
              .to( { opacity: 0 }, 800 )
              .delay( 5000 )
              .easing( TWEEN.Easing.Exponential.InOut )
              .start();
          })
          .start();
      }
    });
  }else{
    cardCarOn = false;

    infoCardCarGrp.traverse( function (child) {
      if ( child.isMesh ) {
        // child.material.opacity = 0;
        let gone = new TWEEN.Tween( child.material )
          .to( { opacity: 0 }, 800 )
          .easing( TWEEN.Easing.Exponential.InOut )
          .start();
      }
    });
  }
}

function carCircle(){
  // console.log(isCarMoving);
  isCarMoving = true;
  let swing_01 = new TWEEN.Tween( carGroup.position )
    .to( { x: -10 }, 3000 )
    .onComplete(function(){

      let swing_02turn = new TWEEN.Tween( carGroup.rotation )
        .to( { y: -180*Math.PI/180  }, 100 )
        .start();

      let swing_02go = new TWEEN.Tween( carGroup.position )
        .to( { z: -5 }, 3000 )
        .onComplete(function(){
          
          let swing_03turn = new TWEEN.Tween( carGroup.rotation )
          .to( { y: -270*Math.PI/180  }, 100 )
          .start();

          let swing_03go = new TWEEN.Tween( carGroup.position )
          .to( { x: 5 }, 3000 )
          .onComplete(function(){

            let swing_04turn = new TWEEN.Tween( carGroup.rotation )
            .to( { y: -360*Math.PI/180 }, 100 )
            .start();

            let swing_04go = new TWEEN.Tween( carGroup.position )
            .to( { z: 10 }, 3000 )
            .onComplete(function(){
              let swing_05turn = new TWEEN.Tween( carGroup.rotation )
              .to( { y: -450*Math.PI/180 }, 100 )
              .onComplete(function(){
                isCarMoving = false;
              })

              .start();
            })
            .start();

          })
          .start();

        })
        .start();

      })
      .start();
}


function showInner(){
  if(!facIsTransparent){
    facIsTransparent = true;
    facGroup.children[0].children[0].material.transparent = true;
    facGroup.children[0].children[0].material.opacity=0.3;
    gateGroup.children[0].children[0].material.transparent = true;
    gateGroup.children[0].children[0].material.opacity=0.3;
    gateBtnGroup.children[0].children[0].material.transparent = true;
    gateBtnGroup.children[0].children[0].material.opacity=0.3;
    
  } else{
    facIsTransparent = false;
    facGroup.children[0].children[0].material.opacity=1;
    gateGroup.children[0].children[0].material.opacity=1;
    gateBtnGroup.children[0].children[0].material.opacity=1;
  }

};

function onDocumentMouseDown(e){
  event.preventDefault();
  mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
  mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;
  raycaster.setFromCamera( mouse, camera );
  let intersects = raycaster.intersectObjects( intersectObjs );
  // console.log(intersects[0]);
  // console.log(intersects);
  if ( intersects.length > 0 ){
    // console.log(intersects[0].object.name);
    // intersects[ 0 ].object.material.color.setHex(Math.random() * 0xffffff);
    
    if(intersects[0].object.name==='floor_inner1'){
      showFacinfoCard();
    }
    if(intersects[0].object.name==='factory_car_a01'){
      showCarinfoCard();
    }
    if(intersects[0].object.name==='roofFrame_a01'){
      showInner();
    }
  }
  
}

function mousedown(e){
    if ( !isCarMoving ) {
      carAudio.play();
      isCarMoving = true;
      renderer.domElement.style.cursor = 'default';
      carMoves();
    }
  }

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
  requestAnimationFrame(animate);
  time += clock.getDelta();
  TWEEN.update();
  carGroup.position.y = Math.cos( time * 22 ) * 0.05;
  if(!isCarMoving){
    carCircle();
  }else{

  }
  if(facIsTransparent){
    innerGroup.children[0].children[0].material.emissive.setRGB((Math.cos( time * 5 ) * 0.25)+0.2, (Math.cos( time * 5 ) * 0.25)+0.2, (Math.cos( time * 5 ) * 0.25)+0.2);
  } else{
    innerGroup.children[0].children[0].material.emissive.setRGB(0, 0, 0);
  }
  infoCardFactoryGrp.lookAt( camera.position );
  infoCardCarGrp.lookAt( camera.position );
  carWorldPosition = new THREE.Vector3();
  carWorldPosition.setFromMatrixPosition( carGroup.matrixWorld );
  infoCardCarGrp.position.set(carWorldPosition.x, carWorldPosition.y+4, carWorldPosition.z);
  // console.log(carWorldPosition);
  renderer.render( scene, camera );
}
