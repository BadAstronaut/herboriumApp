<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    // @ts-ignore
    import { herbStore, herbModels } from "/src/stores/herbStore.ts";
    import { get } from "svelte/store";
    //import * as dat from "dat.gui";

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let ambientLight: THREE.AmbientLight;
    let directionalLight: THREE.DirectionalLight;
    let model: THREE.Object3D;
    let canvas: HTMLCanvasElement;
    let herbs: any;

    onMount(() => {
        init();
        //loadModel();
        //implement on mount
 
        herbStore.subscribe((value: any) => {
            herbs = value;
            if (herbs) {
                loadMultipleModels(herbs.herbs);
            }
            //console.log(herbs,'herbs');
        });

    });

    function init() {
        // Initialize scene
        scene = new THREE.Scene();

        // Initialize camera
        const fov = 75;
        const aspect = canvas.clientWidth / canvas.clientHeight;
        const near = 0.1;
        const far = 1000;
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 5;

        // Initialize renderer
        renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        //orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.5;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        // Initialize ambient light
        ambientLight = new THREE.AmbientLight(0xffe7c4, 0.5);
        scene.add(ambientLight);

        // Initialize directional light
        directionalLight = new THREE.DirectionalLight(0xffe7c4, 0.5);
        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);

        //light controller
        // // Create a new instance of the dat.GUI controller
        // const gui = new dat.GUI();

        // // Create an object to hold the light intensity value
        // const lightProps = {
        //     intensity: 1.0,
        // };

        // // Create a folder for the light controls
        // const lightFolder = gui.addFolder("Light");

        // // Add a controller to adjust the light intensity
        // lightFolder.add(lightProps, "intensity", 0.0, 2.0).onChange((value) => {
        //     light.intensity = value;
        // });

        //raycaster for selection
        function onElementSelected(event: MouseEvent) {
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            //get the current mouse coordinates
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            //window.addEventListener("mousemove", onMouseMove, false);
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children,true);
            //console.log(intersects[0], "intersects");

            if (intersects.length > 0) {
                return intersects[0].object;
                
            }

        }
        renderer.domElement.addEventListener("click", (event) => {
                const seletedObject= onElementSelected(event);
                if(seletedObject){
                    console.log(seletedObject, "click seleccted object");
                    const seledtedHerb = getParentGroup(seletedObject);
                    console.log(seledtedHerb,"click");
                }
                //
                
            });

        //animate
        function animate() {
            controls.update();
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
            
        }
        animate();
    }
    ///////////// Model Loader //////////////
    
    //load model change for herb type once is registered
    function loadModel(modelUrl: string, herb:any) {
        const loader = new GLTFLoader();
        loader.load(modelUrl, (gltf: GLTF) => {
            model = gltf.scene;
            gltf.scene.castShadow = true;
            // Set the receiveShadow property to true on any objects that should receive shadows
            gltf.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.receiveShadow = true;
                }
            });
            // Set the position of the model
            model.position.set(0, 0, 0);
            let x = herb.herb_coordinate[0]
            let y = herb.herb_coordinate[1]
            model.position.set(x, 0, y);
            //we can add properties to map 3D elemnts and other data later on
            model.userData.Herb = herb.herb_name;
            console.log(model, "model.......")
            // Add the model to the scene
            scene.add(model);
        });
    }
    function loadMultipleModels(herbs:any){
        const _herbsModels = get(herbModels);
        herbs.forEach((herb:any) => {
            
            //get url from _herbsModels using herbs.herb_name
            const model_url = _herbsModels[herb.herb_name];
            const model_coord = herb.herb_coordinates.coordinates;
            model_coord.forEach((coord:any) => {
                const herbModelInterface = {
                herb_name: herb.herb_name,
                herb_coordinate: coord,
                };
                loadModel(model_url,herbModelInterface);
            });
            
        });
    }

    ///////////// End Model Loader //////////////
    //will need a recurrent function to check if the parent is a Scene or a Group, if is a group  go check parent again if is a scene return parent
    function getParentGroup(object: THREE.Object3D | null): THREE.Object3D| null {
        if (object && object.userData.Herb) {
            return object;
        } else {
            if (!object) {
                return null;
            }
            return getParentGroup(object.parent);
        }
    }
</script>

<canvas bind:this={canvas} />

<style>
    canvas {
        width: 100%;
        height: 100%;
    }
</style>
