<script lang="ts">
    import { onMount } from "svelte";
    //import write
    //import gsap
    import { gsap, Power1 } from "gsap";
    import { writable, get } from "svelte/store";
    import * as THREE from "three";
    import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
    import { OBJLoader } from "three-obj-loader";
    import InfoModal from "./InfoModal.svelte";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import {
        spotLight,
        zoomToObject,
        animateObjectScale,
        holographicCard,
        dayAndNightAnimation,
        loadbirdFlyingAnimation,
    } from "/src/lib/herbAnimation";
    import {
        CSS2DRenderer,
        CSS2DObject,
    } from "three/addons/renderers/CSS2DRenderer.js";

    // @ts-ignore
    import {
        herbStore,
        herbModels,
        selectedHerbKey,
        herbIoTData,
        herbInstanceStore,
        selectedHerb,
    } from "/src/stores/herbStore.ts";
    //import * as dat from "dat.gui";

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let ambientLight: THREE.AmbientLight;
    let directionalLight: THREE.DirectionalLight;
    let model: THREE.Object3D;
    let canvas: HTMLCanvasElement;
    let herbs: any;
    let selectedHerbObject: any;
    let selectedObjectLight: any;
    let selectedHoloCard: any;
    let birdAnimationMixer: any;
    let clock = new THREE.Clock();
    let prevClickTime = 0;
    let showModal = false;
    let executingCommand: any;
    let renderLabel: any;

    onMount(() => {
        init();
        //loadModel();
        //implement on mount

        herbStore.subscribe((value: any) => {
            herbs = value;
            if (herbs) {
                loadMultipleModels(herbs.herbs);
                //twoDCard(scene)
            }
            //console.log(herbs,'herbs');
        });
    });

    function init() {
        // Initialize scene
        scene = new THREE.Scene();

        // Initialize camera
        const fov = 55;
        const aspect = canvas.clientWidth / canvas.clientHeight;
        const near = 0.1;
        const far = 1000;
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 80;
        camera.position.y = 20;
        camera.position.x = 90;
        const navControls = new PointerLockControls(camera, document.body);
        scene.add(navControls.getObject());

        // Enable navigation controls
        function enableControls() {
            navControls.enabled = true;
        }
        // Disable navigation controls
        function disableControls() {
            navControls.enabled = false;
        }

        // Enable controls to start navigating
        enableControls();
        // ... Three.js scene setup code ...

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // Initialize renderer
        renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        //renderer.shadowMap.bias = 0.001; // Adjust shadow bias if needed
        //renderer.setSize(window.innerWidth, window.innerHeight);
        // Get the device pixel ratio
        const pixelRatio = window.devicePixelRatio || 1;
        renderer.setPixelRatio(pixelRatio);
        //orbit controls

        // Initialize ambient light
        ambientLight = new THREE.AmbientLight(0xffe7c4, 1.0);

        scene.add(ambientLight);

        // Initialize directional light
        directionalLight = new THREE.DirectionalLight(0xffe7c4, 0.2);
        directionalLight.position.set(0, 50, 0);
        directionalLight.castShadow = true;
        directionalLight.receiveShadow = true;
        scene.add(directionalLight);

        const earth = createBasePlane();
        scene.add(earth);
        const currentTime = new Date();
        dayAndNightAnimation(scene, currentTime);

        const cardLabel = threeLabelCardCreate(scene);
        animateFloatingCard(cardLabel, scene, camera);

        loadbirdFlyingAnimation(scene).then((animationMixer) => {
            birdAnimationMixer = animationMixer;
            animate();
        });
        console.log(birdAnimationMixer, "birdAnimationMixer.........");

        function createBasePlane() {
            // Define the dimensions of the plane
            const width = 100;
            const height = 100;
            const thickness = 2.5;

            // Create the shape for extrusion
            const shape = new THREE.Shape();
            shape.moveTo(-width / 2, -height / 2);
            shape.lineTo(width / 2, -height / 2);
            shape.lineTo(width / 2, height / 2);
            shape.lineTo(-width / 2, height / 2);
            shape.lineTo(-width / 2, -height / 2);

            // Extrude the shape to give it thickness
            const extrusionSettings = { depth: thickness, bevelEnabled: false };
            const geometry = new THREE.ExtrudeGeometry(
                shape,
                extrusionSettings
            );

            // Load the texture image
            const textureLoader = new THREE.TextureLoader();
            const earthColor = 0xa29686; // Replace with your desired color code
            const material = new THREE.MeshStandardMaterial({
                color: earthColor,
                roughness: 0.8,
                metalness: 0.2,
            });
            // Create the mesh
            const mesh = new THREE.Mesh(geometry, material);
            mesh.userData.preventSelection = true; // Set the preventSelection property to true
            mesh.receiveShadow = true;
            mesh.castShadow = true;
            mesh.rotation.x = Math.PI / 2;
            mesh.position.y = 3;
            mesh.position.x = 40;
            mesh.position.z = 40;

            return mesh;
        }

        //raycaster for selection
        function onElementSelected(event: MouseEvent) {
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            //get the current mouse coordinates
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            //window.addEventListener("mousemove", onMouseMove, false);
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);
            //console.log(intersects[0], "intersects");
            // Calculate the time elapsed since the previous click
            const currentTime = new Date().getTime();
            const timeElapsed = currentTime - prevClickTime;

            if (intersects.length > 0) {
                const selectedThreeObject = intersects[0].object;
                const selectedObject = getHerbData(intersects[0].object);

                selectedHerbKey.set(selectedObject);
                const parentObjt = getParentGroup(intersects[0].object);
                //console.log(intersects[0].object, "selectedObject");
                //ignore for now because its working
                //selectedHerbObject.material.color.set(0xff0000);
                selectObject(selectedThreeObject);

                //zoomToObject(selectedHerbObject, camera)
                return intersects[0].object;
            }
            if (!intersects.length && timeElapsed < 300) {
                selectedHerbKey.set(null);
                if (selectedHerbObject) {
                    //selectedHerbObject.material.color.set(0xffffff);
                    selectedHerbObject.remove(selectedObjectLight);
                    selectedHerbObject.remove(selectedHoloCard);
                }
                selectedHerbObject = null;
                return null;
            } else {
                // selectedHerbKey.set(null);
                // if (selectedHerbObject){
                //     //selectedHerbObject.material.color.set(0xffffff);
                //     selectedHerbObject.remove(selectedObjectLight);
                //     selectedHerbObject.remove(selectedHoloCard);
                // }
                // selectedHerbObject = null;
                return null;
            }
        }
        //add ccss2d
        function selectObject(object: THREE.Object3D) {
            if (object && object.userData.preventSelection) {
                return; // If the object has the preventSelection property, prevent selection
            }
            // First, remove the selection from the previously selected object if there was one
            if (selectedHerbObject) {
                //selectedHerbObject.material.color.set(0xffffff); // Set the color to white or any other default color
                selectedHerbObject.remove(selectedObjectLight);
                selectedHerbObject.remove(selectedHoloCard);
                console.log(selectedHerbObject, "selectedHerbObject......");
            }
            // Reset the color or any other visual indication of the previous selection

            selectedHerbObject = object;
            // selectedHerbObject.material.color=0xffffff // Set the color to red or any other desired color
            // selectedHerbObject.material.transparent=true // Set the color to red or any other desired color
            // selectedHerbObject.material.opacity=true // Set the color to red or any other desired color

            console.log(selectedHerbObject, "selectedHerbObject......");
            animateObjectScale(selectedHerbObject);
            selectedHoloCard = holographicCard(
                selectedHerbObject,
                get(selectedHerbKey)
            );
            const _spotLight = spotLight(selectedHerbObject);
            selectedObjectLight = _spotLight;
            selectedHerbObject.add(selectedObjectLight);
            selectedHerbObject.add(selectedHoloCard);

            // Apply visual indication to the newly selected object
        }
        //extract the userData object from the selected object
        function getHerbData(object: THREE.Object3D | null): any {
            if (object && object.userData.Herb) {
                const herbObject = {
                    herb: object.userData.Herb,
                    herbId: object.userData.HerbId,
                };
                return herbObject;
            } else {
                if (!object) {
                    return null;
                }
                return getHerbData(object.parent);
            }
        }
        renderer.domElement.addEventListener("click", (event) => {
            //cast selected object to three.object3D
            const seletedObject = onElementSelected(event) as THREE.Object3D;
            const selectedHerb = getHerbData(seletedObject);
            //
        });

        //animateposition Vector3 {x: -0.031931713223457336, y: 4.759241580963135, z: -0.06477349996566772}

        function animate() {
            controls.update();
            //animate bird
            const delta = clock.getDelta();
            if (birdAnimationMixer) {
                birdAnimationMixer.update(delta);
            }
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
            //labelRenderer.render(scene, camera);
            // console.log(labelRenderer, "camera position")
        }

        const controls = new OrbitControls(camera, renderer.domElement);
        //controls.domElement = labelRenderer.domElement;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.5;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        //implement pan functionality when middle click is pressed or hold down on mobile
        controls.enablePan = true;
        controls.screenSpacePanning = false;

        animate();
    }

    //need to create a gsap animation of the twoDcard to make it look like its floating
    function animateFloatingCard(labelObject: any, scene: any, camera: any) {
        console.log(labelObject.infoLabel.position, "label.................");
        gsap.to(labelObject.infoLabel.position, {
            duration: 2,
            y: 0.5,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            onUpdate: () => {
                renderLabel.render(scene, camera);
            },
        });
    }
    function threeLabelCardCreate(v: any, labelContent: any) {
        labelContent = {
            title: "Earth",
            icon: "https://threejs.org/examples/textures/uv_grid_opengl.jpg",
            description:
                "Earth is the third planet from the Sun and the only astronomical object known to harbor life.",
        };
        const scene = v;
        const earthDiv = document.createElement("div");
        earthDiv.className = "label";
        earthDiv.innerHTML = `
                            <div class="card" style="width: 10em; height:auto; border-radius: 0.4em; background-color: rgba(255, 255, 255, 0.5); box-shadow: 0  2px 5px rgba(144, 144, 144, 0.2); padding:0.3em">
                                <div class="flex-container" style ="display:flex; flex-direction:row; align-items:center; gap:0.5em; ">
                                    <img src="${labelContent.icon}" alt="Icon" style="width: 1em; height: 1em;">
                                    <h2 style="font-size: 0.8em; margin-bottom: 0.5em;">${labelContent.title}</h2>
                                </div>
                                <p style="font-size: 0.6em;">${labelContent.description}</p>
                            </div>
                            `;

        const infoLabel = new CSS2DObject(earthDiv);
        //get the possition of objectAttached and set the origin of the, implement later infoLabelobjectAttached: any
        //infoLabel.position.copy(objectAttached.position);
        infoLabel.position.set(0, 10, 0);
        infoLabel.center.set(0, 0);
        infoLabel.layers.set(0);
        scene.add(infoLabel);

        const parentContainer = canvas.parentElement;
        console.log("scene data tree-----------", parentContainer);
        renderLabel = new CSS2DRenderer(renderer.domElement);
        renderLabel.setSize(
            parentContainer.clientWidth,
            parentContainer.clientHeight
        );

        //this line is to avoid clicking the text
        renderLabel.domElement.style.pointerEvents = "none";
        renderLabel.domElement.style.position = "absolute";
        renderLabel.domElement.style.top = "0px";

        //append labelRenderer to the parent container
        parentContainer.appendChild(renderLabel.domElement);

        const cardLabelObject = {
            infoLabel: infoLabel,
            renderLabel: renderLabel,
        };

        return cardLabelObject;
    }
    ///////////// Model Loader //////////////

    //load model change for herb type once is registered
    function loadModel(modelUrl: string, herb: any) {
        const loader = new GLTFLoader();
        loader.load(modelUrl, (gltf: GLTF) => {
            model = gltf.scene;
            //gltf.scene.castShadow = true;
            // Set the receiveShadow property  true on any objects that should receive shadows
            gltf.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    //child.receiveShadow = true;
                    child.castShadow = true;
                }
            });
            // Set the position of the model
            model.position.set(0, 0, 0);
            let x = herb.herb_coordinate[0];
            let y = herb.herb_coordinate[1];
            model.position.set(x, 0, y);
            //we can add properties to map 3D elemnts and other data later on
            model.userData.Herb = herb.herb_name;
            model.userData.HerbId = herb.herb_id;
            //console.log(model, "model.......")
            // Add the model to the scene
            scene.add(model);
        });
    }
    function loadMultipleModels(herbs: any) {
        const _herbsModels = get(herbModels) as [];
        let _herbInstances = [];
        herbs.forEach((herb: any) => {
            //get url from _herbsModels using herbs.herb_name
            const model_url = _herbsModels[herb.herb_name];
            const model_coord = herb.herb_coordinates.coordinates;

            let indexId = 0;
            model_coord.forEach((coord: any) => {
                //concatenate herbname and idenxid
                const herbModelInterface = {
                    herb_name: herb.herb_name,
                    herb_coordinate: coord,
                    herb_id: herb.herb_name + indexId.toString(),
                };
                indexId++;
                _herbInstances.push(herbModelInterface);
                //console.log(model_coord, "herb coordinate to ID");
                loadModel(model_url, herbModelInterface);
            });
        });
        herbInstanceStore.set(_herbInstances);
    }

    ///////////// End Model Loader //////////////
    //will need a recurrent function to check if the parent is a Scene or a Group, if is a group  go check parent again if is a scene return parent
    function getParentGroup(
        object: THREE.Object3D | null
    ): THREE.Object3D | null {
        if (object && object.userData.Herb) {
            return object;
        } else {
            if (!object) {
                return null;
            }
            return getParentGroup(object.parent);
        }
    }
    //we need to add a button in the top right corner of the scene that displays a modal
    //with the herb information and a button to close the modal
    function onDisplayInfo() {
        showModal = true;
        executingCommand = "info";
    }
    function onDisplayFeed() {
        showModal = true;
        executingCommand = "feed";
    }
</script>

<canvas class="three-container" bind:this={canvas} />
{#if showModal}
    <InfoModal
        bind:showModal
        onClose={() => (showModal = false)}
        {executingCommand}
    />
{/if}
<div class="button-container">
    <button id="info" on:click={onDisplayInfo}>
        <div class="icon-container">
            <img class="info-icon" src="/clipboard-heart.svg" />
        </div>
    </button>
    <button id="feed" on:click={onDisplayFeed}>
        <div class="icon-container">
            <img
                class="info-icon"
                style="width=50%"
                src="/droplet-filled-2.svg"
            />
        </div>
    </button>
</div>

<style>
    .three-container {
        width: 100%;
        height: 100%;
    }
    .button-container {
        position: absolute;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: flex-start;
        gap: 0.75rem;
        width: auto;
        top: 3.5rem;
        right: 1rem;
        z-index: 1000;
    }
    button {
        background-color: rgba(201, 231, 202, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        border: none;
        height: 1.75rem;
        width: 1.75rem;
        padding: 0;
        box-shadow: 0 2px 4px darkslategray;
        border-radius: 50%;
        z-index: 1000;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    button:hover {
        background-color: rgba(231, 202, 201, 0.5);
        box-shadow: 0 2px 4px darkslategray;
        transform: scale(1.1);
    }
    button:active {
        background-color: rgba(201, 215, 231, 0.5);
        box-shadow: 0 2px 4px darkslategray;
        transform: scale(1.1);
    }
    .icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        /* Adjust the size of the container as needed */
        width: inherit;
        height: inherit;
        /* Add any additional container styles */
    }
    .info-icon {
        position: absolute;
        width: 1.3rem;
        height: 1.3rem;
        color: white;
        fill: white;
    }
    /* trying to style the card in three js  */
</style>
