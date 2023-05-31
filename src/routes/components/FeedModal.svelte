<script lang="ts">
    import { enhance } from '$app/forms';
    import { get } from "svelte/store";
    import { onMount } from "svelte";
    
    /** @type {import('./$types').PageData} */
    export let data;
    /** @type {import('./$types').ActionData} */
    export let form;

    let waterAmount = 0;

    function increment(event) {
        //prevent default form action 
        event?.preventDefault();
        waterAmount += 50;
    }

    function decrement(event) {
        event?.preventDefault();
        if (waterAmount >= 50) {
            waterAmount -= 50;
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<form method="POST" action="?/feed" use:enhance  class="feed-content">
    <div class="upper-menu">
        <button type="submit" class="submit-button">S</button>
    </div>
    <div class="water-counter"> 
        <button class="feed-button" on:click={decrement}>-</button>
        <input name="water" type="number" class="feed-input"  bind:value={waterAmount} />
        <button class="feed-button" on:click={increment}>+</button>
    </div>
</form>

<style>
    .feed-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        height: 100%;
        width: 100%;
        max-width: 50rem;
    }
    .water-counter {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        height: 100%;
        width: 100%;
        max-width: 50rem;
    }
    .feed-button {
        background-color: #4caf50; /* Green */
        border: none;
        color: white;
        padding: 16px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        border-radius: 3rem;
        width: 1.5rem;
    }
    .feed-input{
        border: none;
        color: white;
        padding: 16px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        width: 8rem;
    }
</style>
