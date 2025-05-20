<template>
    <div class="hand-container flex gap-2" ref="parent">
        <transition-group name="card-slide" tag="div" class="flex gap-2">
            <HandCardWrapper v-for="card in player?.hand" :key="'hand-card-' + card.instanceId" :card="card"
                :is-enemy="isEnemy" :player="player">
            </HandCardWrapper>

        </transition-group>
    </div>
</template>


<script setup lang="ts">
// =============================
// 📦 Imports
// =============================
import { Player } from '@/classes/Player';
import HandCardWrapper from './HandCardWrapper.vue';



interface HandContainerProps {
    player?: Player;
    isEnemy?: boolean;
}

const { player, isEnemy } = defineProps<HandContainerProps>();

</script>

<style scoped>
.hand-container {
    user-select: none;
    z-index: 999;
}


.hand-card {
    cursor: grab !important;
    height: 240px;
    width: 170px;
}

.card-slide-enter-active {
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.card-slide-enter-from {
    transform: translateX(80px) scale(0.8);
    opacity: 0;
}

.card-slide-enter-to {
    transform: translateX(0) scale(1);
    opacity: 1;
}

.card-slide-leave-active {
    transition: transform 0.3s ease-in, opacity 0.3s ease-in;
}

.card-slide-leave-from {
    transform: translateX(0) scale(1);
    opacity: 1;
}

.card-slide-leave-to {
    transform: translateX(-80px) scale(0.8);
    opacity: 0;
}
</style>