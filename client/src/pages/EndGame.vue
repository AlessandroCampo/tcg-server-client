<template>
    <div class="end-game-container h-screen w-screen flex flex-col gap-10 justify-center items-center"
        :class="isWinner ? 'bg-green-500' : 'bg-red-500'">
        <h2 class="text-6xl">
            {{ isWinner ? 'YOU WON' : 'YOU LOST' }}
        </h2>
        <Button @click="myRouter.push('/')">Play again</Button>
        <!-- Template content -->
    </div>
</template>

<script setup lang="ts">

import { myRouter } from '@/router';
import { computed } from 'vue';

interface EndGameProps {
    outcome: string
};

const { outcome } = defineProps<EndGameProps>();

const isWinner = computed(() => {
    return outcome == 'winner' ? true : false;
})

</script>

<style scoped>
/* Scoped styles for the component */
</style>