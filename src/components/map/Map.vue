<script>
  import { computed } from '@vue/reactivity';
  import { Loader } from '@googlemaps/js-api-loader';
  import { onMounted, onUnmounted, ref, watch } from 'vue';

  //custom components
  import { useGeolocation } from './useGeolocation';
  import { generateMarkers, generateLines } from './Marker';

  //store
  import { useBusStore } from '@/stores/bus';
  
  const googleMapsApiKey = process.env.VUE_APP_GOOGLEKEY

  const busStore = useBusStore()
  
  export default {
    name: 'Map',
    setup() {
      const { coords } = useGeolocation()
      const currPos = computed(() => ({
        lat: coords.value.latitude,
        lng: coords.value.longitude
      }))

      console.log(googleMapsApiKey)
      const loader = new Loader({apiKey: googleMapsApiKey})
      const mapDiv = ref(null)
      let map = ref(null)
      let clickListener = null

      onMounted(async () => {
        await loader.load()

        map.value = new google.maps.Map(mapDiv.value, {
          center: currPos.value,
          zoom: 8
        })

        generateMarkers(map.value, busStore.buses);
        generateLines(map.value, busStore.lines);

      })

      onUnmounted(async () => {
        if(clickListener) clickListener.remove()
      })

      return { currPos, mapDiv }
    }
  }
</script>

<template>
  <div ref="mapDiv" class="map"></div>
</template>