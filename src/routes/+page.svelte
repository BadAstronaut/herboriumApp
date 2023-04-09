<script lang="ts">
    import ThreeViewer from "./components/ThreeViewer.svelte";
    import GrowLog from "./components/GrowLog.svelte";
    import {onMount} from 'svelte';
    
    export let data;
    console.log(data, "from page");


    //on page load fetch data from the getHerbs endpoint 
    //and store it in the herbs variable

    //implement onmount
    onMount(async () => {
        // const json = await response.json();
        // console.log(json);
    });
    
</script>
<body>
    <div class="three-viewer">
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
    .three-viewer{
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        width: 100%;
        height: 50%;
        background-color: lightgoldenrodyellow;
    }
    .grow-log{
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        width: 100%;
        height: auto;
        overflow: auto;
        margin: 0;
    }
</style>

