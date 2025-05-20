<template>
    <div class="component-name bg-black h-screen">
        <QueueButton />

    </div>
</template>

<script setup lang="ts">
import QueueButton from '@/components/misc/QueueButton.vue';
import { BACKEND_URL } from '@/composables/useSocket';
import { onMounted } from 'vue';

onMounted(() => {
    alert
})
</script>

<style scoped>
/* Scoped styles for the component */
</style>