<script lang="ts">
    // @ts-ignore
    import pico from "@picocss/pico";
    //import styles.css to be used in the layout
   //import "css/styles.css";
</script>

<nav >
    <!-- add logoCTEC as a a logo in the top left corner of the nav bar -->
    <img
        class="logo"
        src="/tempLogo.png"
        alt="logoCTEC"
        width="50px"
        height="auto"
    />
    <a class="logo-text" data-sveltekit-preload-data="tap" href="/">Herborium</a>
</nav>

<main>
    <slot />
</main>

<footer class="layout">© Herborium Aframe</footer>

<style>
    nav {
        display: flex;
        flex-direction: row;
        position: absolute;
        align-items: center;
        justify-content: center;
        padding-top: 1rem;
        padding-bottom: 1rem;
        width: 100%;
    }
    nav,
    footer {
        text-transform: uppercase;
        font-size: 0.7rem;
        letter-spacing: 0.1px;
        font-weight: 500;
    }
    .logo {
        position: absolute;
        top: -5px;
        left: 0;
        padding: 5px;
    }
    :global(html) {
        /* scrollbar-gutter: stable; */
        overflow: hidden;
        overflow-y: scroll;
    }
    
    main {
        display: flex;
        flex-direction: row;
        min-height: calc(100vh - 5rem);
        width: 100%;
        align-items: stretch;
    }
    footer {
        text-align: center;
        margin: 0.4rem 0;
        color: rgba(94, 104, 121, 0.388);
        padding: 0;
        max-height: 30px;
    }
</style>
