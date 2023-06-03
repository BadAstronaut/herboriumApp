<script lang="ts">
    import { onMount } from "svelte";
    //on destroy
    import { onDestroy } from "svelte";
    import Chart from "chart.js/auto";
    import type { ChartConfiguration, ChartData } from "chart.js";
    import { get } from "svelte/store";
    import * as THREE from "three";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
    // @ts-ignore
    import {
        selectedHerbKey,
        herbStore,
        herbModels,
        herbIoTData,
    } from "/src/stores/herbStore.ts";

    export let showModal: boolean; // boolean
    let chartData: any; // any
    let selecteHerb =get(selectedHerbKey) ;
    let canvasModal: HTMLCanvasElement; // HTMLCanvasElement
    let model: THREE.Object3D;
    let scene: THREE.Scene;
    let chartInstance: Chart;
    //last container holder
    let lastWatered: string;
    let lastFeed: string;
    let battery: string;
    let plantedDate: string;
    let harvestDate: string;
    let chartCanvas: HTMLCanvasElement;
    let chartjsData: ChartData;
    let chartjsOptions: ChartConfiguration;

    //we need a funtion that runs once the component is finish loading 
    onMount(async () => {
        //load the plant data
        console.log("onMount..........", showModal);
        loadPlantData();
        //load the 3d model
        createThreeScene();
        
    });

    $: {//had to add chartCanvas here to make it work since it runs before onMount, this part is the one giving problemes in vercel
        if (showModal && chartCanvas && canvasModal) {
            //loadPlantData();
            selecteHerb = get(selectedHerbKey);
            //this bit is breaking vercel, probably something loading before onMount is done 
            if (selecteHerb) {
                //createThreeScene();
                //console.log("createThreeScene", scene);
                //add chart
                let iotData = get(herbIoTData);
                let lastIotValue = helper_getLastOrFirstValue(iotData);
                battery = lastIotValue.battery;
                const labels = iotData.map((item) => {
                    const date = new Date(item.created_at);
                    return date.getDate();
                });
                const values = iotData.map((item) => item.temperature);
                const soilMoistureValues = iotData.map(
                    (item) => item.soil_moisture
                );
                chartjsData = {
                    labels: labels, // Provide your data labels here
                    datasets: [
                        {
                            label: "Temperatura", // Provide a label for the dataset
                            id: "temperature",
                            data: values, // Provide your data values here
                            borderColor: "rgb(75, 192, 192)", // Customize the line color
                            fill: true, // Set to false to remove fill color below the line
                        },
                        {
                            label: "Soil Moisture",
                            id: "soil_moisture",
                            data: soilMoistureValues,
                            borderColor: "rgb(192, 75, 192)",
                            fill: false,
                        },
                    ],
                };

                chartjsOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: [
                            {
                                type: "linear",
                                display: false,
                                position: "left",
                                id: "temperature",
                                beginAtZero: true,
                                scaleLabel: {
                                    display: false,
                                    labelString: "Temperature (°C)",
                                },
                            },
                            {
                                type: "linear",
                                display: false,
                                position: "left",
                                id: "soil_moisture",
                                beginAtZero: true,
                                ticks: {
                                    callback: function (value) {
                                        return value + "%";
                                    },
                                },
                                scaleLabel: {
                                    display: false,
                                    labelString: "Soil Moisture (%)",
                                },
                            },
                        ],
                    },
                    plugins: {
                        legend: {
                            display: false, // Hide the legend
                        },
                    },
                };
                // Add more chart options as needed
                createChart(chartjsData, chartjsData);
                
            }

        }
        ///////// neeed to improve this part do discart the scene and chart on
        else if (chartInstance && scene) {
            console.log("destroy", showModal);
            //destroy chart
            chartInstance.destroy();
            //destroy scene
            // Dispose materials and textures
            // scene.traverse((object) => {
            //     if (object.isMesh) {
            //         // Dispose material
            //         object.material.dispose();

            //         // Dispose textures
            //         if (object.material.map) object.material.map.dispose();
            //         if (object.material.normalMap)
            //             object.material.normalMap.dispose();
            //         // ... dispose other textures if needed
            //     }
            // });

            // Remove scene objects
            scene.remove(...scene.children);
            //scene.destroy();
            // reset scene as empty

            model = null;
        }
    }

    //console.log(selecteHerb);
    //create functions to render a threejs scene with the selected herb
    function createThreeScene() {
        //create a scene
        scene = new THREE.Scene();
        //create a camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        //create a renderer
        //position the camara in a way that the herb is in the center of the screen
        //and the camera is looking at the herb
        camera.position.set(3, 1, 1);
        camera.lookAt(0, 0, 0);
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasModal,
            alpha: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Get the device pixel ratio
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        const pixelRatio = window.devicePixelRatio || 1;

        // Set the pixel ratio for the renderer
        renderer.setPixelRatio(pixelRatio);
        //add warm lightning to the scene
        const light = new THREE.AmbientLight(0x404040); // soft white light
        scene.add(light);
        //add a directional light pointing to the origin
        const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
        directionalLight.position.set(1, 2, 6);
        scene.add(directionalLight);

        // Create the plane geometry
        const planeGeometry = new THREE.PlaneGeometry(10, 10); // Adjust the size as needed

        // Create the plane material
        const planeMaterial = new THREE.MeshStandardMaterial({
            color: 0xfdfefd, // Adjust the color as needed
            roughness: 0,
            metalness: 0.3,
        });

        // Create the plane mesh
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        planeMesh.receiveShadow = true; // Enable shadow reception on the plane

        // Set the position and rotation of the plane
        planeMesh.position.set(0, -1, 0); // Adjust the position as needed
        planeMesh.rotation.x = -Math.PI / 2; // Rotate the plane to face upward

        // Add the plane to the scene
        //scene.add(planeMesh);

        //move camera back
        //camera.position.z = 5;
        //create a render function
        console.log(get(herbModels)[selecteHerb.herb], "selecteHerb................from modal");
        loadModel(get(herbModels)[selecteHerb.herb], selecteHerb.herb);

        const render = function () {
            requestAnimationFrame(render);
            // cube.rotation.x += 0.01;
            // cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        render();
    }

    function loadModel(modelUrl: string, herb: any) {
        const loader = new GLTFLoader();
        loader.load(modelUrl, (gltf: GLTF) => {
            model = gltf.scene;
            //gltf.scene.castShadow = true;
            // Set the receiveShadow property  true on any objects that should receive shadows
            const scaleValue = 0.2;
            gltf.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    //child.receiveShadow = true;
                    child.castShadow = true;
                    flatShading: false;
                }
            });
            model.scale.set(scaleValue, scaleValue, scaleValue);
            // Set the position of the model
            model.position.set(0, -1, 0);
            //we can add properties to map 3D elemnts and other data later on
            model.userData.Herb = herb.herb_name;
            //console.log(scene, "model.......");
            // Add the model to the scene
            scene.add(model);
        });
    }
    //charting
    function createChart(data: ChartData, options: ChartConfiguration): void {
        const canvas = document.getElementById(
            "plantChart"
        ) as HTMLCanvasElement;
        console.log("create chart,,,,,,,,", chartCanvas, ",,,,,", canvas);

        const ctx = chartCanvas.getContext("2d");

        if (ctx) {
            chartInstance = new Chart(ctx, {
                type: "line",
                data,
                options,
            });
        }
    }

    function updateChart(data: ChartData): void {
        if (chartInstance) {
            chartInstance.data = data;
            chartInstance.update();
        }
    }

    function loadPlantData() {
        const platData = get(herbStore);
        //filter plantData for the selected herb
        const selectedPlantData = platData.herbs.filter(
            (plant) => plant.herb_name === selecteHerb.herb
        )[0];
        lastWatered = helper_getLastOrFirstValue(
            selectedPlantData.watered.water
        ).water_data;
        lastFeed = helper_getLastOrFirstValue(
            selectedPlantData.feeded.feed
        ).feed_data;
        //set lastWatered to the timestamp day
        lastWatered = new Date(lastWatered.timestamp).toLocaleDateString();
        lastFeed = new Date(lastFeed.timestamp).toLocaleDateString();
        plantedDate = selectedPlantData.planted_date;
        harvestDate = selectedPlantData.planed_harvest_date;

        console.log(selectedPlantData, "plant data");
    }
    function helper_getLastOrFirstValue(list: any[]) {
        return list.length === 1 ? list[0] : list[list.length - 1];
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->

<div class="dialog-content-iot" >
    <div class="head-container">
        <h2>{selecteHerb.herb}</h2>
        <div class="last-container">
            <p>Last <span class="emoji">💧</span>: {lastWatered}</p>
            <p>Last <span class="emoji">🧃</span>: {lastFeed}</p>
        </div>
    </div>

    <div class="chart-area">
        <canvas bind:this={chartCanvas} width="400" height="400" />
    </div>
    <div class="plant-info-container">
        <p><span class="emoji">🔋</span> Level: {battery} %</p>
        <p><span class="emoji">🌱</span> Date: {plantedDate}</p>
        <p><span class="emoji">👨🏼‍🌾</span> Harvest Date: {plantedDate}</p>
    </div>
    <div class="three-container">
        <canvas class="three-plant-view" bind:this={canvasModal} />
    </div>
</div>

<style>
    .dialog-content-iot {
        display: flex;
        flex-direction: column;
        background-color: rgba(253, 254, 253, 0.5);
        align-items: inherit;
        justify-content: inherit;
        height: 95%;
        width: 100%;
        padding: 1em;
    }
    .head-container {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        height: 15%;
        width: inherit;
        padding: 0;
        margin: 0;
    }
    .plant-info-container {
        display: flex;
        margin-top: 0.3rem;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        height: 35%;
        width: inherit;
        padding: 0;
    }
    .three-container {
        display: flex;
        bottom: 0;
        right: 0;
        position: absolute;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 50%;
        width: 50%;
        padding: 0;
        z-index: 1;
        pointer-events: none;
    }
    .three-plant-view {
        padding: 0%;
    }
    .chart-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 50%;
        width: inherit;
        padding: 0;
    }

    @keyframes zoom {
        from {
            transform: scale(0.95);
        }
        to {
            transform: scale(1);
        }
    }

    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
