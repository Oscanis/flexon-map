<script>
  import { onMounted, onUnmounted, ref } from 'vue';
  import { parseXLSX } from './xlsProcessor';

  export default {
    name: 'Upload',
    data() {
        return{
        }
    },
    setup() {
      const file = ref(null)
      const conversion = ref(false)
      let loaded = ref(false)

      const handleFileUpload = async() => {
        parseXLSX(file.value.files[0], conversion.value).then(loaded.value = true)
      }

      return {
        handleFileUpload,
        file,
        loaded,
        conversion
      }

    },
    methods: {
      parseXLSX
    }
  }
</script>

<template>
    <div class="content-container d-flex text-center align-items-center flex-column">
        <div class="m-auto">
            <h4>Excel fájl feltöltése</h4>
        </div>
        <label for="checkbox">
          <input type="checkbox" id="checkbox" v-model="conversion" />
          <span class="ms-3">EOV -> WGS konverzió</span>
        </label>
        <label for="fileselector" class="button-link">Fájl kiválasztása</label>
        <input ref="file" v-on:change="handleFileUpload()"  type="file" id="fileselector" style="visibility: hidden;">
        <div v-if="loaded">
          Betöltve!
          <router-link to="/map" class="button-link m-auto">
                Térkép megnyitása
            </router-link>
        </div>
    </div>
</template>