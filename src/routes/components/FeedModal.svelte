<script lang="ts">
    import { get } from "svelte/store";
    import {onDestroy} from "svelte";
    import { onMount } from "svelte";
    import { selectedHerbKey, herbInstanceStore } from "../../stores/herbStore";
    import MultiSelect from "./MultiSelect.svelte";

    export let showModal: boolean; // boolean
    

    let waterAmount = 500;
    let fetlizerAmount = 5;
    let selectedPlants: any;
    let currentSelection =get(selectedHerbKey); 
    let herbsInScene = get(herbInstanceStore);
    let filteredherbs = filterHerbsInScene();

    $: {
        if (showModal) {
            currentSelection =get(selectedHerbKey); 
            filteredherbs = filterHerbsInScene();
            console.log("showing modal.......", get(selectedHerbKey));
        } else {
            console.log("closssing show modal.......");
        }
    }
    

    //create a function     that filter herbsInScene based on selectedPlants
    function filterHerbsInScene() {
        let _herbs = [];
        herbsInScene.forEach((herb) => {
            if (currentSelection.herb === herb.herb_name) {
                _herbs.push(herb);
            }
        });
        return _herbs;
        console.log("selectedPlants", selectedPlants);
        console.log("herbsInScene", herbsInScene);
        // return herbsInScene.filter((herb) => selectedPlants.includes(herb.id));
    }
    function increment() {
        //prevent default form action
        waterAmount += 50;
    }

    function decrement() {
        if (waterAmount >= 50) {
            waterAmount -= 50;
        }
    }

    function incrementFertilizer() {
        //prevent default form action
        fetlizerAmount += 1;
    }
    function decrementFertilizer() {
        if (fetlizerAmount >= 1) {
            fetlizerAmount -= 1;
        }
    }
    //form submit handler
    async function submit(event) {
        event.preventDefault();
        // console.log(waterAmount);
        // const response = await fetch("/api/feed", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ waterAmount }),
        // });
        // const json = await response.json();

        console.log("get selected plant", selectedPlants);
        console.log(waterAmount);
        console.log("selected Plant;.......", get(herbInstanceStore));
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<form on:submit={submit} class="feed-content" >
    <div class="upper-menu">
        <button type="submit" class="submit-button">
            <img class="feed-info-icon" src="/device-floppy.svg" alt="s" />
        </button>
    </div>
    <MultiSelect
        id="lang"
        value={[currentSelection.herbId]}
        bind:selectedPlants
    >
        {#each filteredherbs as herb}
            <option value={herb.herb_id}>{herb.herb_id}</option>
        {/each}
    </MultiSelect>
    <div class="action-div">
        <p>Water:</p>
        <div class="counter-div">
            <button class="feed-button" on:click={decrement}>
                <img class="feed-info-icon" src="/minus.svg" alt="-" />
            </button>
            <div class="input-div">
                <input
                    name="water"
                    type="number"
                    class="feed-input"
                    bind:value={waterAmount}
                />
                <p>ml</p>
            </div>
            <button class="feed-button" on:click={increment}>
                <img class="feed-info-icon" src="/plus.svg" alt="+" />
            </button>
        </div>
    </div>
    <div class="action-div">
        <p>Fetilizer:</p>
        <div class="counter-div">
            <button class="feed-button" on:click={decrementFertilizer}>
                <img class="feed-info-icon" src="/minus.svg" alt="-" />
            </button>
            <div class="input-div">
                <input
                    name="water"
                    type="number"
                    class="feed-input"
                    bind:value={fetlizerAmount}
                />
                <p>ml</p>
            </div>
            <button class="feed-button" on:click={incrementFertilizer}>
                <img class="feed-info-icon" src="/plus.svg" alt="+" />
            </button>
        </div>
    </div>
</form>

<style>
    .feed-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        justify-content: flex-start;
        height: 100%;
        width: 100%;
        max-width: 50rem;
    }
    .action-div {
        width: 100%;
        max-width: 50rem;
    }
    .counter-div {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        border: solid 1px #a2a2a2;
        justify-content: space-evenly;
        height: 4rem;
        border-radius: 0.4rem;
        width: 100%;
        max-width: 50rem;
    }
    .submit-button {
        background-color: #ffffff;
        border: solid 1px #a2a2a2;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.75rem;
        height: 2.75rem;
        margin-bottom: 0.5rem;
    }
    .feed-button {
        background-color: #ffffff;
        border: solid 1px #a2a2a2;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.75rem;
        height: 2.75rem;
        margin-bottom: 0.5rem;
    }

    .feed-info-icon {
        position: relative;
        margin: 0;
    }
    .input-div {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 6rem;
        max-width: 50rem;
    }
    .feed-input {
        border: none;
        color: white;
        text-align: end;
        width: 80%;
        position: relative;
        top: 50%;
        margin-bottom: 0.5rem;
    }
    img {
        max-width: none;
        margin: 0;
        padding: 0;
    }
    p {
        text-align: start;
        top: 50%;
        color: #ffffff;
        width: 20%;
        margin-bottom: 0.5rem;
        padding-left: 0;
    }
</style>
