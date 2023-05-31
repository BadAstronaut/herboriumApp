<script lang="ts">
    import { onMount } from "svelte";
    //on destroy 
    import { onDestroy } from "svelte";

    import { get } from "svelte/store";

    import ModalIoT from "./ModalIoT.svelte";

    import FeedModal from "./FeedModal.svelte";

    export let showModal: boolean; // boolean
    
    export let executingCommand: string //id of command to execute

    let dialog: HTMLDialogElement; // HTMLDialogElement
    //on destroy reset the chart and scene 

    $: {
        if (dialog && showModal) {
            dialog.showModal();
            console.log("showing modal.;.......", executingCommand);
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
        <div class="dialog-content" >
            <ModalIoT showModal={showModal} />
            <!-- <img class="background-image" src="/Info-Background.png" /> 
            {#if executingCommand == "info"}
                <ModalIoT showModal={showModal} />
            {:else if executingCommand == "feed"}
                <FeedModal showModal={showModal} />
            {/if}
        -->
            <button
                class="close-button"
                autofocus
                on:click={() => dialog.close()}>Close</button
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
    .close-button {
        position: fixed;
        bottom: 0;
        text-decoration: solid;
        width: 10em;
        border-radius: 0.2em;
        border: 1px solid #ccc;
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
