<script lang="ts">
    import { get } from "svelte/store";
    import {onDestroy} from "svelte";
    import { onMount } from "svelte";
    import { selectedHerbKey, herbInstanceStore } from "../../stores/herbStore";
    import MultiSelect from "./MultiSelect.svelte";

    export let showModal: boolean; // boolean
    //dialog.close on the parent element 
    export let dialog: any;

    let waterAmount = 0;
    let fetlizerAmount = 0;
    let selectedPlants: any;
    let currentSelection =get(selectedHerbKey); 
    let herbsInScene = get(herbInstanceStore);
    let filteredherbs = filterHerbsInScene();
    let value = [currentSelection.herbId];

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
    function increment(event: Event) {
        event.preventDefault();
        //prevent default form action
        waterAmount += 50;
    }

    function decrement(event: Event) {
        event.preventDefault();
        if (waterAmount >= 50) {
            waterAmount -= 50;
        }
    }

    function incrementFertilizer(event: Event) {
        event.preventDefault();
        //prevent default form action
        fetlizerAmount += 1;
    }
    function decrementFertilizer(event: Event) {
        event.preventDefault();
        if (fetlizerAmount >= 1) {
            fetlizerAmount -= 1;
        }
    }
    async function  postToEndpoint(waterAmount: Number, fetlizerAmount:Number, herbName: String, herbInstance: String){
        let timestamp = new Date().toISOString();
        const res = await fetch("/api/supa/feedHerbs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "timestamp": timestamp,
                "herbName":herbName,
                "herbInstance":herbInstance,
                "water":waterAmount,
                "fertilizer":fetlizerAmount,
            }),
        });
        const data = await res.json();
        const status = await res.status;
        showModal = false;
        dialog.close();
        console.log("data", status, data);
    }
    //form submit handler
    async function submit(event: Event) {
        event.preventDefault();
        if(value.length > 0){
            //check if water or fertilizer amount is not 0
            //if it is 0, do not post to the endpoint
            if(waterAmount === 0 && fetlizerAmount === 0){
                return;
                //implemente a toast message need to add water or fertilizer!

            }
            else{
                value.forEach((herbId)=>{
                //get the herb object from filteredherbs array base on herbId
                let herbObject = filteredherbs.filter((herb)=>herb.herb_id === herbId)[0];
                let timestamp = new Date().toISOString();
                console.log("herbObject", herbObject);
                //let waterAmount = herbObject.water_amount;
                postToEndpoint(waterAmount, fetlizerAmount, herbObject.herb_name, herbId);
            })
            }
            
        }
        //close the modal after sending 
        
        


        console.log("get selected plant", value);
        console.log(waterAmount);
        console.log("selected Plant;.......", get(herbInstanceStore));
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events  value={[currentSelection.herbId]}-->
<form on:submit={submit} class="feed-content" >
    <div class="upper-menu">
        <button type="submit" class="submit-button">
            <img class="feed-info-icon" src="/device-floppy.svg" alt="s" />
        </button>
    </div>
    <MultiSelect
        id="lang"
        bind:value
        
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
