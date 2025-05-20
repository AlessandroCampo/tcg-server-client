<template>
    <div class="component-name">
        <Button @click="joinQueue">{{ isWaiting ? 'Waiting for opponent...' : 'Join queue' }}</Button>
    </div>
</template>

<script setup lang="ts">
import { useSocket } from '@/composables/useSocket';
import { useMultiplayer } from '@/composables/useMultiplayer';

const { isWaiting } = useMultiplayer();


const { emit, on } = useSocket();

const joinQueue = () => {
    emit('joinQueue');
}
</script>

<style scoped>
/* Scoped styles for the component */
</style>