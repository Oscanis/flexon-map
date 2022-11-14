import { onMounted, onUnmounted, ref } from 'vue'

export function useGeolocation() {
    //default coords is Budapest
    const coords = ref({ latitude: 47.497913, longitude: 19.040236 })
    const isSupported = 'navigator' in window && 'geolocation' in navigator

    let watcher = null
    onMounted(() => {
        if (isSupported)
            watcher = navigator.geolocation.watchPosition(
                position => (coords.value = position.coords)
            )
    })

    onUnmounted(() => {
        if(watcher)
            navigator.geolocation.clearWatch(watcher)
    })
    
    return { coords, isSupported }
}