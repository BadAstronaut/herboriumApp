import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
//import gsap 
import { gsap, Power1  } from 'gsap';

export function spotLight(object:THREE.Object3D){
    const spotLight = new THREE.SpotLight(0xffffff,0.75,100,Math.PI/4,0.7,0.5);
    spotLight.position.set(object.position.x, 25, object.position.z);
    spotLight.castShadow = true;
    spotLight.target = object;
    spotLight.receiveShadow = true;
    // Set up shadow properties
    spotLight.shadow.mapSize.width = 1024; // Adjust shadow map size if needed
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 0.5; // Adjust near and far values if needed
    spotLight.shadow.camera.far = 20;
    spotLight.shadow.camera.fov = 10; // Adjust field of view if needed

    return spotLight;
}

export function zoomToObject (object:THREE.Object3D, camera:THREE.PerspectiveCamera){
    // Get the position of the selected object
  const targetPosition = object.position;

  // Set the camera's destination position
  const destinationPosition = {
    x: targetPosition.x*100,
    y: targetPosition.y,
    z: targetPosition.z*100 // Adjust the zoom level as per your preference
  };
  console.log(destinationPosition);

  // Animate the camera zoom using GSAP
  gsap.to(camera.position, {
    x: destinationPosition.x,
    y: destinationPosition.y,
    z: destinationPosition.z,
    duration: 1, // Set the duration of the zoom animation
    ease: 'power2.inOut', // Set the easing function for the animation
  });
}

export function animateObjectScale(object: THREE.Object3D, duration = 1) {
  //object.position.y += 5;
  const initialScale = new THREE.Vector3(1, 1, 1);
  const initialPosition = object.position.clone();
  const originalPosition = object.position.clone(); // Store the original position
  console.log(initialPosition, "initialPosition");
  gsap.fromTo(
      object.scale,
      { x: 1, y: 1, z: 1 },
      {
        x: 1.2,
        y: 1.1,
        z: 1.2,
        duration: duration / 2,
        ease: Power1.easeOut,
        repeat: 2,
        yoyo: true,
        onUpdate: () => {
          // Restore the original position during the animation
          object.position.copy(originalPosition);
        },
        onComplete: () => {
          gsap.to(object.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: duration / 2,
            ease: Power1.easeIn,
            onUpdate: () => {
              object.scale.copy(initialScale);
              object.position.copy(initialPosition);
            }
          });
        }
      }
    );
  }

export function holographicCard(object: THREE.Object3D, textToRender: string){
  // Create a procedural texture for frosted glass effect

// Load the frosted glass texture image
  // Once the texture is loaded, set the appropriate filters
  const textureLoader = new THREE.TextureLoader();
  const glassTexture = textureLoader.load('/frostedGlass.jpeg');
  const cardMaterial = new THREE.MeshStandardMaterial({
    map: glassTexture,
    roughness: 0.2,   // Adjust the roughness to control the smoothness of the material
    metalness: 0.1,   // Increase the metalness for a glass-like appearance
    transparent: true,   // Enable transparency for the frosted effect
    opacity: 0.5,   // Adjust the opacity to control the level of frostiness
  });
  
  // Create a holographic card mesh
  const shape = new THREE.Shape();
  const width = 4; // Adjust the width of the rectangle
  const height = 2; // Adjust the height of the rectangle
  const radius = 0.1; // Adjust the radius of the rounded corners

  shape.moveTo(-width / 2 + radius, -height / 2);
  shape.lineTo(width / 2 - radius, -height / 2);
  shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
  shape.lineTo(width / 2, height / 2 - radius);
  shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
  shape.lineTo(-width / 2 + radius, height / 2);
  shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
  shape.lineTo(-width / 2, -height / 2 + radius);
  shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);
  // ...
  const segments = 16; // Adjust the number of segments for smoothness

  const geometry = new THREE.ShapeBufferGeometry(shape, segments);

  shape.lineTo(-width / 2 + radius, -height / 2);

  const cardGeometry = new THREE.PlaneGeometry(6, 2); // Adjust the dimensions as needed
  const cardMesh = new THREE.Mesh(geometry, cardMaterial);
  
  // Create text mesh
  const fontLoader = new FontLoader();
  console.log(fontLoader, "fontLoader");
  fontLoader.load('src/lib/threeFont.json', (font) => {
    const textGeometry = new TextGeometry(textToRender, {
      font: font,
      size: 0.5, // Adjust the text size as needed
      height: 0.05, // Adjust the extrusion height as needed
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xb2dfdb }); // Adjust the text color as needed
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    const relativeLeft = width/2 - radius*2;
    const relativeTop = height/4 - radius*2;
    textMesh.position.set(-relativeLeft, relativeTop, 0); // Adjust the position relative to the center of the card as needed
    cardMesh.add(textMesh);
  });
  
  // Position the card component over an object
  object.position.set(0, 0, 0); // Set the position of the object
  cardMesh.position.copy(object.position);
  cardMesh.position.y += 10; // Adjust the height of the card as needed
  cardMesh.rotation.copy(object.rotation);
  return cardMesh;
}

export function dayAndNightAnimation (scene: THREE.Scene, currentTime: number){
  const sunLight  = new THREE.DirectionalLight(0xffffff, 1.1);
  sunLight .position.set(0, 10, 0);
  sunLight .castShadow = true;
  scene.add(sunLight );

  const moonLight = new THREE.PointLight(0xffffff, 0.7);
  moonLight.position.set(0, -1, 0); // Assuming Y-axis is up
  moonLight.castShadow = true;
  scene.add(moonLight);

  // Animate the day and night cycle
  const hours = currentTime.getHours();

  if (hours >= 6 && hours < 18) {
    // Morning or afternoon
    const intensity = hours < 12 ? (12 - hours) / 6 : (hours - 12) / 6;
    console.log(intensity, "intensity");
    sunLight.intensity = intensity*1.3;
    moonLight.intensity = 0;
  } else {
    // Night
    sunLight.intensity = 0;
    moonLight.intensity = 0.5;
  }
}

export function loadbirdFlyingAnimation(scene: THREE.Scene): Promise<THREE.AnimationMixer | undefined> {
  const loader = new GLTFLoader();

  return new Promise<THREE.AnimationMixer | undefined>((resolve) => {
    loader.load('threemodels/low_poly_bird_animated.glb', (gltf) => {
      const birdModel = gltf.scene; // Get the root object of the loaded model
      // Set up initial position, rotation, and scale for the bird
      birdModel.position.set(0, 10, 0);
      birdModel.rotation.set(0, Math.PI / 2, 0);
      birdModel.scale.set(1, 1, 1);

      // Add the bird model to the scene
      scene.add(birdModel);

      // Play the bird's animation
      const animations = gltf.animations;
      console.log(animations, "animations");
      if (animations && animations.length > 0) {
        const animationMixer = new THREE.AnimationMixer(birdModel);
        const animationClip = gltf.animations[0]; // Assuming it's the first animation clip in the array
        // Create an AnimationAction
        const action = animationMixer.clipAction(animationClip);

        // Set the desired playback parameters (optional)
        action.loop = THREE.LoopRepeat; // Animation should loop
        action.timeScale = 4.96;
        action.repetitions = 100; // Number of repetitions (when looping)
        action.clampWhenFinished = true; // Animation should stop at the end

        // Play the animation
        action.play();
        resolve(animationMixer);
      } else {
        resolve(undefined);
      }
    });
  });
}