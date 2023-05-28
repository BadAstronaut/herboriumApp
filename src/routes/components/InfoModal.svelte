<script lang="ts">
    import { onMount } from "svelte";
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
    export let chartData: any; // any

    let dialog: HTMLDialogElement; // HTMLDialogElement
    let selecteHerb = get(selectedHerbKey);
    let canvas: HTMLCanvasElement; // HTMLCanvasElement
    let model: THREE.Object3D;
    let scene: THREE.Scene;
    let chartInstance: Chart;

    $: {
        if (dialog && showModal) {
            dialog.showModal();
            selecteHerb = get(selectedHerbKey);
            createThreeScene();

            //add chart
            let iotData = get(herbIoTData);
            const labels = iotData.map((item) => {
                const date = new Date(item.created_at);
                return date.getDate();
            });
            const values = iotData.map((item) => item.temperature);
            const soilMoistureValues = iotData.map((item) => item.soil_moisture);
            const data = {
                labels: labels, // Provide your data labels here
                datasets: [
                    {
                        label: "Temperatura", // Provide a label for the dataset
                        id:"temperature",
                        data: values, // Provide your data values here
                        borderColor: "rgb(75, 192, 192)", // Customize the line color
                        fill: true, // Set to false to remove fill color below the line
                        
                    },
                    {
                    label: "Soil Moisture",
                    id:"soil_moisture",
                    data: soilMoistureValues,
                    borderColor: "rgb(192, 75, 192)",
                    fill: false,
                    },
                ],
            };

            const options = {
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

            createChart(data, options);
        }
    }

    console.log(selecteHerb);
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
            canvas: canvas,
            alpha: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
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
        console.log(get(herbIoTData), "selecteHerb....from modal");
        loadModel(get(herbModels)[selecteHerb], selecteHerb);

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
                }
            });
            model.scale.set(scaleValue, scaleValue, scaleValue);
            // Set the position of the model
            model.position.set(0, -1, 0);
            //we can add properties to map 3D elemnts and other data later on
            model.userData.Herb = herb.herb_name;
            console.log(model, "model.......");
            // Add the model to the scene
            scene.add(model);
        });
    }
    //charting
    function createChart(data: ChartData, options: ChartConfiguration): void {
        const canvas = document.getElementById(
            "plantChart"
        ) as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

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
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
    bind:this={dialog}
    on:close={() => (showModal = false)}
    on:click|self={() => dialog.close()}
>
    <div class="dialog-container">
        <div class="dialog-content" on:click|stopPropagation>
            <img class="background-image" src="/Info-Background.png" />

            <h2>{selecteHerb}</h2>
            <div class="chart-area">
                <canvas id="plantChart" width="400" height="400" />
            </div>
            <div class="three-container">
                <canvas class="three-plant-view" bind:this={canvas} />
            </div>

            <button
                class="close-button"
                autofocus
                on:click={() => dialog.close()}>close modal</button
            >
        </div>
    </div>
</dialog>

<style>
    .dialog-container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 100%;
        width: 100%;
        max-width: 50rem;
    }
    .background-image {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        height: 100%;
        max-height: 100%;
        z-index: -1;
    }
    .dialog-content {
        display: flex;
        flex-direction: column;
        background-color: rgba(253, 254, 253, 0.5);
        align-items: inherit;
        justify-content: inherit;
        height: 95%;
        width: inherit;
        padding: 1em;
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
        border: 1px solid black;
        height: 50%;
        width: inherit;
        padding: 0;
    }
    .close-button {
        position: fixed;
        bottom: 0;
        width: 40%;
        border-radius: 0.2em;
        border: 1px solid #ccc;
        background: #eee;
        cursor: pointer;
        align-self: center;
        justify-self: end;
    }
    dialog {
        max-width: 50rem;
        border-radius: 0.2em;
        border: 1px solid #ccc;

        padding: 0;
    }
    dialog::backdrop {
        background: rgba(0, 0, 0, 0.3);
    }
    dialog > div {
        padding: 1em;
    }
    dialog[open] {
        animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes zoom {
        from {
            transform: scale(0.95);
        }
        to {
            transform: scale(1);
        }
    }
    dialog[open]::backdrop {
        animation: fade 0.2s ease-out;
    }
    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    button {
        display: block;
    }
</style>
