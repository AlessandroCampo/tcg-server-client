<template>
    <ul class="hand-container flex gap-2" ref="parent">
        <li v-for="card in player?.hand" :key="'hand-card-' + card.instanceId" class="card-container hand-card"
            :data-id="card.instanceId" :class="[isEnemy ? 'enemy' : 'ally', isMyTurn ? 'draggable' : '']">
            <GlareCard :card="card" :show-back="isEnemy" :is-enemy="isEnemy" />
        </li>

    </ul>
</template>

<script setup lang="ts">
// =============================
// 📦 Imports
// =============================
import { Player } from '@/classes/Player';
import GlareCard from '../ui/glare-card/GlareCard.vue';
import interact from 'interactjs';
import { onMounted } from 'vue';
import { useGameController } from '@/stores/gameController';
import { storeToRefs } from 'pinia';
import { Card } from '@shared/Card';
import { setupDraggable } from '@/composables/useDraggable';


interface HandContainerProps {
    player?: Player;
    isEnemy?: boolean;
}

const { player, isEnemy } = defineProps<HandContainerProps>();
const { isMyTurn } = storeToRefs(useGameController());

onMounted(() => {



    setupDraggable('.hand-card.draggable');

    // Save reference if needed later
});
</script>

<style scoped>
.hand-container {
    user-select: none;
}

.hand-card {
    cursor: grab !important;
    height: 240px;
    width: 170px;
}
</style>