<template>
    <div class="card-container hand-card" :data-id="card.instanceId" :class="[isEnemy ? 'enemy' : 'ally', isMyTurn ? 'draggable' : '', availableTargets.length && isTargetable(card) ? 'targetable' : '',
    availableTargets.length && !isTargetable(card) ? 'not-targetable' : '',
    player?.bloodThirst && card.btText ? 'bloodthirst-active' : ''

    ]" @click="handleClick(card)">
        <GlareCard :card="card" :show-back="isEnemy" :is-enemy="isEnemy" :is-bt="player?.bloodThirst" />
    </div>

</template>

<script setup lang="ts">
import { Player } from '@/classes/Player';
import { useMultiplayer } from '@/composables/useMultiplayer';
import { Card } from '@shared/Card';
import GlareCard from '../ui/glare-card/GlareCard.vue';
import { storeToRefs } from 'pinia';
import { useGameController } from '@/stores/gameController';
import { onMounted } from 'vue';
import { setupDraggable } from '@/composables/useDraggable';
const { isMyTurn } = storeToRefs(useGameController());

interface Props {
    card: Card;
    isEnemy: boolean;
    player?: Player;
}
const props = defineProps<Props>();


onMounted(() => {
    setupDraggable('.hand-card.draggable');
});


const { availableTargets, onTargetSelected } = useMultiplayer();


const isTargetable = (card: Card) => {
    return availableTargets.value.some((c: Card) => c.instanceId === card.instanceId);
};

const handleClick = (card: Card) => {
    if (!availableTargets.value.length || !onTargetSelected.value) return;
    onTargetSelected.value(card.instanceId);
};
</script>

<style scoped>
.targetable {
    outline: 4px solid #00ff99;
    border-radius: 12px;
    animation: pulse 1s infinite ease-in-out;
    cursor: pointer !important;
}

.targetable:hover {
    transform: scale(1.05);
    transition: transform 0.15s ease;
}

.not-targetable {
    pointer-events: none;
    filter: grayscale(60%) brightness(0.5);
}

.card-container {
    z-index: 10;
}

.bloodthirst-active {
    position: relative;
    box-shadow: 0 0 18px 6px rgba(255, 0, 0, 0.8);

    animation: pulse-bloodthirst 0.9s infinite ease-in-out;
    z-index: 2;
    filter: contrast(1.1) saturate(2) hue-rotate(-10deg) drop-shadow(0 0 10px red);
}

.bloodthirst-active::after {
    content: '';
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 120%;
    background: radial-gradient(circle, rgba(255, 20, 20, 0.4), transparent 80%);
    border-radius: 14px;
    pointer-events: none;
    animation: blood-flicker 0.6s infinite ease-in-out;
    z-index: -1;
}

@keyframes pulse-bloodthirst {
    0% {
        box-shadow: 0 0 10px rgba(180, 0, 0, 0.4);
    }

    50% {
        box-shadow: 0 0 14px rgba(255, 0, 0, 0.8);
    }

    100% {
        box-shadow: 0 0 10px rgba(180, 0, 0, 0.4);
    }
}

@keyframes blood-flicker {

    0%,
    100% {
        opacity: 0.4;
    }

    50% {
        opacity: 0.8;
    }
}
</style>