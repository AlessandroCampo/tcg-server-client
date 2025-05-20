<template>
  <div v-if="socketInit">

    <router-view />
  </div>
</template>


<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import { BACKEND_URL, initSocket } from './composables/useSocket';

const socketInit = ref(false);

onBeforeMount(() => {
  //const userBackendUrl = prompt("Inserisci l'URL del server per il test:");
  /*LINK - 
  if (userBackendUrl) {
    BACKEND_URL.value = userBackendUrl;
  }
  */


  initSocket();
  socketInit.value = true;

})

onMounted(() => {
})

</script>