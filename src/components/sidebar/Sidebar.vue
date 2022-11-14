<script>
    /* eslint-disable */
    import { collapsed, toggleSidebar, sidebarWidth } from './state';
    import SidebarLink from './SidebarLink.vue';
    import 'vue-router';

    export default {
        name: 'SidebarComponent',
        components: { SidebarLink },
        props: {},
        setup() {
            return { collapsed, toggleSidebar, sidebarWidth }
        }
    }
</script>

<template>
    <div class="sidebar" :style="{ width: sidebarWidth }">
        <h1>
            <span v-if="collapsed">
            </span>
            <span v-else>
                Flexon
            </span>
        </h1>

        <!-- <SidebarLink to="/" icon="fas fa-home">Kezdőlap</SidebarLink> -->
        <SidebarLink to="/" icon="fas fa-file-excel">Feltöltés</SidebarLink>
        <SidebarLink to="/map" icon="fas fa-map-location">Térkép</SidebarLink>

        <span
            class="collapse-icon"
            :class="{ 'rotate-180': collapsed }"
            @click="toggleSidebar"
        >
            <i class="fas fa-angle-double-left" />
        </span>

    </div>
</template>

<style>
:root {
    --sidebar-bg-color: #2f855a;
    --sidebar-item-hover: #38a169;
    --sidebar-item-active: #276749;
}
</style>

<style scoped>
    .sidebar {
        color: white;
        background-color: var(--sidebar-bg-color);
        float: left;
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        bottom: 0;
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        transition: 0.3s ease;
    }

    .collapse-icon {
        position: absolute;
        bottom: 0;
        margin-bottom: 1rem;
        margin-left: 0.2rem;
        

        color: rgba(255, 255, 255, 0.7);
        transition: 0.2s linear;
    }

    .rotate-180 {
        transform: rotate(180deg);
        transition: 0.2s linear;
    }
</style>