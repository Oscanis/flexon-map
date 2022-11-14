<script>
  import Sidebar from './components/sidebar/Sidebar';
  import { sidebarWidth } from './components/sidebar/state';

  export default {
    name: 'App',
    components: { Sidebar },
    setup() {
      return {}
    }
  }
</script>

<template>
  <Sidebar />
  <div :style="{'margin-left': sidebarWidth}">
    <router-view/>
  </div>
</template>

<!-- global styling -->
<style>
  :root {
    --main-bg-color: #2f855a;
    --main-item-hover: #38a169;
    --main-item-active: #276749;
  }
  .content-container {
    padding-top: 2rem;
    max-width: 1136px;
    margin: auto;
    position: relative;
  }
  .button-link {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    font-weight: 400;
    user-select: none;
    padding: 1rem;
    border-radius: 0.25rem;
    height: 1.5rem;
    width: max-content;
    color: white;
    text-decoration: none;
    background-color: var(--main-bg-color);
  }
  .button-link:hover {
    background-color: var(--main-item-hover);
    color: white;
 }

 .button-link:active {
    background-color: var(--main-item-active);
    color: white;
 }
  .map {
    float: right;
    width: calc(100% - 38px);
    height: 100vh;
  }
</style>