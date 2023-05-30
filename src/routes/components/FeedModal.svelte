<script lang="ts">
    import { get } from "svelte/store";
    import { onMount } from "svelte";

    let waterAmount = 0;

    function increment() {
        waterAmount += 50;
    }

    function decrement() {
        if (waterAmount >= 50) {
            waterAmount -= 50;
        }
    }
    function handleSubmit(event) {
        event.preventDefault();
        console.log("Water amount:.....", waterAmount);
        // You can perform additional actions here, such as submitting the form data to a server.
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<form method="POST"  class="feed-content">
    <div class="upper-menu">
        <button type="submit" class="submit-button">S</button>
    </div>
    <div class="water-counter"> 
        <button class="feed-button" on:click={decrement}>-</button>
        <input class="feed-input"  bind:value={waterAmount} />
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
