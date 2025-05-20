<!-- components/board/CardWrapper.vue -->
<template>
    <div class="board-card-wrapper" ref="elRef" :style="{
        position: 'absolute',
        left: left + 'px',
        top: '50%',

        transform: transformValue,
    }" @dblclick="() => handleDoubleClick(card)" @click="() => handleClick(card)" :id="card.instanceId">
        <div v-if="isBeingDestroyed" class="destruction-flash"></div>
        <div class="drag-wrapper" :data-id="card.instanceId" :class="[
            isEnemy ? 'enemy-board-card' : 'my-board-card',
            !isEnemy && card.isActive ? 'draggable' : '',
            availableTargets.length && isTargetable(card) ? 'targetable' : '',
            availableTargets.length && !isTargetable(card) ? 'not-targetable' : '',
        ]" @dragstart.prevent>
            <div class="board-card" :class="[card.isHorizontal ? 'horizontal' : 'vertical',
            card.isActive && !card.statusConditions.includes(StatusCondition.CHAINED) ? 'active' : 'inactive',
            player.bloodThirst && card.btText ? 'bloodthirst-active' : ''

            ]">
                <GlareCard :card="card" :show-back="false" :is-enemy="isEnemy" :is-bt="player.bloodThirst" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, computed } from 'vue';
import GlareCard from '../ui/glare-card/GlareCard.vue';
import { Card, StatusCondition } from '@shared/Card';
import { useMultiplayer } from '@/composables/useMultiplayer';
import { useGameController } from '@/stores/gameController';
import { Player } from '@/classes/Player';

interface Props {
    card: Card;
    index: number;
    left: number;
    isEnemy: boolean;
    isBeingDestroyed?: boolean;
    player: Player;
}
const props = defineProps<Props>();

const elRef = ref<HTMLElement | null>(null);
const { availableTargets, onTargetSelected } = useMultiplayer();
const gameController = useGameController();

const previousLeft = ref(props.left);
const transformValue = ref('translate(0, -50%)');

watch(() => props.left, async (newLeft, oldLeft) => {
    await nextTick();
    const deltaX = oldLeft - newLeft;

    if (deltaX !== 0 && elRef.value) {
        transformValue.value = `translate(${deltaX}px, -50%)`;
        elRef.value.style.transition = 'none';

        requestAnimationFrame(() => {
            if (elRef.value) {
                elRef.value.style.transition = 'transform 300ms ease';
                transformValue.value = 'translate(0, -50%)';
            }
        });
    }

    previousLeft.value = newLeft;
});

const handleDoubleClick = (card: Card) => {
    if (props.isEnemy || availableTargets.value.length) return;
    gameController.changePosition(card.instanceId);
};

const handleClick = (card: Card) => {
    if (!availableTargets.value.length || !onTargetSelected.value) return;
    onTargetSelected.value(card.instanceId);
};

const isTargetable = (card: Card) => {
    return availableTargets.value.some((c: Card) => c.instanceId === card.instanceId);
};
</script>
<style scoped>
.board-card-wrapper {
    width: 240px;
    height: 170px;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateY(-50%);
    user-select: none;
    transition: transform 0.15s ease;
}

.drag-wrapper {
    will-change: transform;
    transition: none !important;
    width: 170px;
    height: 240px;
    position: relative;
    touch-action: none;
    user-select: none;
}

.board-card {
    height: 240px;
    width: 170px;
    transition: transform 0.3s ease;
    transform-origin: center center;
}

.board-card.horizontal {
    transform: rotate(90deg);
}

.board-card.vertical {
    transform: rotate(0deg);
}

.enemy-board-card {
    transform: rotate(180deg);
}

.board-card.inactive {
    filter: grayscale(60%) contrast(60%);
}

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

.drag-wrapper.not-targetable {
    pointer-events: none;
    filter: grayscale(60%) brightness(0.5);
}

.destruction-flash {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 200px;
    transform: translate(-50%, -50%) scale(1);
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.9), transparent 70%);
    animation: flash-burst 400ms ease-out;
    pointer-events: none;
    z-index: 10;
}




@keyframes flash-burst {
    0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(0.6);
    }

    50% {
        opacity: 0.9;
        transform: translate(-50%, -50%) scale(1.4);
    }

    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(2);
    }
}


@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(0, 255, 153, 0.7);
    }

    70% {
        box-shadow: 0 0 0 12px rgba(0, 255, 153, 0);
        scale: 1.03;
    }

    100% {
        box-shadow: 0 0 0 0 rgba(0, 255, 153, 0);
        scale: 1;
    }
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
