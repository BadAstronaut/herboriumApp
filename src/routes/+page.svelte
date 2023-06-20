<script lang="ts">
    import ThreeViewer from "./components/ThreeViewer.svelte";
    import GrowLog from "./components/GrowLog.svelte";
    import WaterBarMonitor from "./components/WaterBarMonitor.svelte";
    import { onMount } from "svelte";

    export let props;
    console.log(props, "from page");

    //on page load fetch data from the getHerbs endpoint
    //and store it in the herbs variable

    //implement onmount
    onMount(async () => {
        // const json = await response.json();
        // console.log(json);
    });
</script>

<body>
    <div class="water-part">
        <div class="water-bar-monitor">
            <WaterBarMonitor />
        </div>
        <div class="humidity-bar">
            {#each ["60+", "45", "30-"] as cat}
                <div class="himidity-marker-div">
                    <div class="dash-bar" />
                    <p class="dash-number">{cat}</p>
                </div>
            {/each}
        </div>
        <div class="water-info">
            <div class="icon-container">
                <img class="info-icon" src="/droplet-filled.svg" />
            </div>
            <div class="icon-container">
                <img class="info-icon" src="/droplet.svg" />
            </div>
        </div>
    </div>
    <div class="three-viewer-main">
        <ThreeViewer />
    </div>
    <div class="grow-log">
        <GrowLog />
    </div>
</body>

<style>
    body {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
    }
    .water-part {
        z-index: 1000;
        transition: all 0.2s ease;
        margin: 0;
        padding: 0;
        position: absolute;
        display: flex;
        flex-direction: columns;
        top: 8%;
        left: 3%;
        width: 2.5rem;
        height: 10rem;
    }
    .dash-number {
        font-size: 0.75rem;
        top: 0.5rem;
        color: rgba(44, 52, 65, 0.5);
        margin: 0;
    }
    .dash-bar {
        width: 4px;
        height: 0.075rem;
        position: relative;
        background-color: rgba(44, 52, 65, 0.5);
    }
    .himidity-marker-div {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 2px;
        align-items: center;
    }
    .humidity-bar {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        width: 2em;
        height: 80%;
        color: white;
        border: none;
        position: absolute;
        top: 1rem;
        left: 0;
        margin-left: 1.4em;
        
    }
    .water-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        width: 50%;
        height: 100%;
        color: white;
        border: none;
    }
    .water-bar-monitor {
        background-color: rgba(201, 231, 202, 0.5);
        color: white;
        border: none;
        width: 60%;
        box-shadow: 0 2px 4px darkslategray;
        border-radius: 5px;
    }
    .three-viewer-main {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        width: 100%;
        height: 50%;
        background-color: whitesmoke;
    }
    .grow-log {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        width: 100%;
        height: 50%;
        overflow: auto;
        margin: 0;
    }
</style>
