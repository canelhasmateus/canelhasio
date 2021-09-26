<div class="root">
    <div class="blurred" style="z-index: 10">

    </div>

    <Sidebar class="sidebar sidebar-div">
    </Sidebar>
</div>

<script lang="ts">
    import Sidebar from "./components/Sidebar.svelte";
</script>


<style>
    :global( html ) {
        height: 100%;
    }

    :global( body ) {
        margin: 0;
        height: 100%;
        min-height: 100%;
        overflow: hidden;
        color: #b3c0c2;
        background-color: #1a1618
    }

    .blurred {
        /*height: 100%;*/
        width: 100vh;
        color: transparent;
        z-index: 2;
        /*backdrop-filter: blur(10px);*/
    }

    .root {
        height: 100%;
    }

    :global( .sidebar ) {

        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: space-evenly;
        z-index: 1;
        position: sticky;
        left: 100%;
        height: 100%;
        width: 25%;
        background-color: rgba(179, 192, 194, 0.10);

        /*overflow: hidden;*/
    }

</style>
