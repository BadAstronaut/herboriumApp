<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { onMount } from "svelte";
    import {get} from 'svelte/store';
    // @ts-ignore
    import {currentWaterLevel} from "/src/stores/herbStore.ts";
    import { tooltip } from 'svooltip';
	import 'svooltip/styles.css'; // Include default styling
    let currentHumidity = 0;
    let barHeight = 60;
    let isActive = true;

    $: if (barHeight === 100) {
        //this will go to trigger a pop up on page load showing the watering state
        //but this will be done from a store not here.
        //stopProgress();
        //setTimeout(resetBar, 2500);
    }

    const stopProgress = () => {
        clearInterval(progress);
        isActive = false;
    };

    const resetBar = () => {
        stopProgress();
        barHeight = 0;
    };
    onMount(() => {
        console.log("mounted");
        barHeight = get(currentWaterLevel).waterLevel;
        currentHumidity = get(currentWaterLevel).herbObject.soil_moisture;

        console.log(currentHumidity);
        //makeProgress();
    });

    const addColor = () => (barHeight += 1);

    const randomTime = () => Math.floor(Math.random() * 60);

    const makeProgress = () => {
        isActive = true;
    };
</script>

<!-- {#if barHeight === 100}
    <div id="complete-msg-cont">
        <h3 id="complete-msg" in:fly={{ x: -300 }} out:fly={{ x: 300 }}>
            Your file has been uploaded!
        </h3>
    </div>
{/if} -->
<div id="waterLevel" >
    {#if isActive}
        <div id="myBar" style="height: {barHeight}%" use:tooltip={{
            content: `Humedad Actual: ${currentHumidity}%`,
            placement: 'right',
            delay: [1000, 0],
            offset: 15,
        }}>
            <!--Waves Container-->
            <div>
                <svg
                    class="waves"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 24 150 28"
                    preserveAspectRatio="none"
                    shape-rendering="auto"
                >
                    <defs>
                        <path
                            id="gentle-wave"
                            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                        />
                    </defs>
                    <g class="parallax">
                        <use
                            xlink:href="#gentle-wave"
                            x="48"
                            y="0"
                            fill="rgba(255,255,255,0.7"
                        />
                        <use
                            xlink:href="#gentle-wave"
                            x="48"
                            y="3"
                            fill="rgba(255,255,255,0.5)"
                        />
                        <use
                            xlink:href="#gentle-wave"
                            x="48"
                            y="5"
                            fill="rgba(255,255,255,0.3)"
                        />
                        <use
                            xlink:href="#gentle-wave"
                            x="48"
                            y="7"
                            fill="#fff"
                        />
                    </g>
                </svg>
            </div>
            <!--Waves end-->
        </div>
    {/if}
</div>

<style>
    #waterLevel {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: flex-end;
        height: 100%;
        padding: 0.2em;
    }
    
    svooltip {
	--svooltip-bg: green;
}


    #myBar {
        width: 100%;
        height: 100%;
        background: linear-gradient(
            60deg,
            rgba(211,222,235,0.5) 0%,
            rgba(109,146,190,0.7) 100%
        );
        color: white;
        border-radius: 5px;
    }

    @keyframes blink {
        to {
            opacity: 0;
        }
    }


    /* weve water efefct */

    .waves {
        position: relative;
        min-height: 0.3rem;
        width: 100%;
        margin: 0;
        padding: 0;
        margin-bottom: -7px; /*Fix for safari gap*/
    }

    /* Animation */

    .parallax > use {
        animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
    }
    .parallax > use:nth-child(1) {
        animation-delay: -2s;
        animation-duration: 7s;
    }
    .parallax > use:nth-child(2) {
        animation-delay: -3s;
        animation-duration: 10s;
    }
    .parallax > use:nth-child(3) {
        animation-delay: -4s;
        animation-duration: 13s;
    }
    .parallax > use:nth-child(4) {
        animation-delay: -5s;
        animation-duration: 20s;
    }
    @keyframes move-forever {
        0% {
            transform: translate3d(-90px, 0, 0);
        }
        100% {
            transform: translate3d(85px, 0, 0);
        }
    }
    /*Shrinking for mobile*/
    @media (max-width: 768px) {
        .waves {
            height: 0.3rem;
            width: 100%;
            margin: auto;
        }
    }
</style>
