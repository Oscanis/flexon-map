<template>
      <div class="content-container text-center justify-content-center">
        <h4>Flexon Térkép</h4>
        <div class="mt-5">
            <p>Első lépés: töltsd fel az Excel fájlt. Enélkül csak minta adatok jelennek meg.</p>
            <router-link to="/upload" class="button-link m-auto">
                Excel fájl feltöltése
            </router-link>
            <p class="mt-5">Második lépés: nyisd meg a térképet</p>
            <router-link to="/map" class="button-link m-auto">
                Térkép megnyitása
            </router-link>
        </div>
    </div>
</template>
