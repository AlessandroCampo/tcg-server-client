<template>
    <div class="board" :class="isEnemy && 'mb-3'">
        <transition-group name="destroy" tag="div" class="relative w-full h-full">
            <CardWrapper v-for="(card, i) in player.board" :key="'field-card-' + card.instanceId" :card="card"
                :index="i" :left="cardPositions[i]?.left" :is-enemy="isEnemy" class="destroy-card"
                :is-being-destroyed="destroyedCardsIds.includes(card.instanceId)" :player="player" />
        </transition-group>

        <div v-if="player.board.length === 0" class="empty-placeholder" />
    </div>
</template>


<script setup lang="ts">
// =============================
// 📦 Imports
// =============================
// Import Vue functions, composables, components, types, etc.

import { Player } from '@/classes/Player';
import { Card } from '@shared/Card';

import GlareCard from '../ui/glare-card/GlareCard.vue';
import { onMounted, computed, watch, ref, nextTick } from 'vue';
import interact from 'interactjs';
import { useGameController } from '@/stores/gameController';
import { validator } from '@shared/validations';
import { EventType } from '@shared/interfaces';
import { setupDraggable } from '@/composables/useDraggable';
import { useMultiplayer } from '@/composables/useMultiplayer';
import CardWrapper from './CardWrapper.vue';

const gameController = useGameController();
const { availableTargets, onTargetSelected, destroyedCardsIds } = useMultiplayer();


interface HandContainerProps {
    player: Player,
    isEnemy: boolean
};

const { player, isEnemy } = defineProps<HandContainerProps>();



const cardRefs = ref<HTMLElement[]>([]);

// Mappa con le posizioni precedenti
const previousLeftMap = new Map<string, number>();

watch(() => player.board.map(c => c.instanceId), async () => {
    await nextTick(); // Aspetta che il DOM venga aggiornato

    player.board.forEach((card, i) => {
        const el = cardRefs.value[i];
        if (!el) return;

        const newLeft = cardPositions.value[i]?.left ?? 0;
        const prevLeft = previousLeftMap.get(card.instanceId) ?? newLeft;
        const deltaX = prevLeft - newLeft;

        if (deltaX !== 0) {
            el.style.transition = 'none';
            el.style.transform = `translateX(${deltaX}px)`;

            requestAnimationFrame(() => {
                el.style.transition = 'transform 300ms ease';
                el.style.transform = `translate(${deltaX}px, -50%)`;
            });
        }

        previousLeftMap.set(card.instanceId, newLeft);
    });
});


onMounted(() => {
    interact('.board').dropzone({
        accept: '.hand-card.ally',
        overlap: 0.75,

        ondropactivate(event) {
            event.target.classList.add('drop-active');
        },

        ondragenter(event) {
            event.target.classList.add('drop-target');
        },

        ondragleave(event) {
            event.target.classList.remove('drop-target');
        },

        ondrop(event) {
            if (isEnemy) return;
            const draggedElement = event.relatedTarget;
            if (draggedElement) {
                const droppedId = draggedElement.dataset.id;
                //const playedCard = player.playCard(droppedId);
                const playedCard = player.hand.find(c => c.instanceId == droppedId);
                //client validation
                if (playedCard) gameController.playCard(droppedId);
            }
        },



        ondropdeactivate(event) {
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });

    interact('.enemy-board-card').dropzone({
        accept: '.my-board-card',
        overlap: 0.75,

        ondropactivate(event) {
            event.target.classList.add('drop-active');
        },

        ondragenter(event) {
            event.target.classList.add('drop-target');
        },

        ondragleave(event) {
            event.target.classList.remove('drop-target');
        },

        ondrop(event) {
            if (!isEnemy) return;
            const draggedElement = event.relatedTarget;
            const dropTarget = event.target;

            if (draggedElement && dropTarget) {
                const draggedElementId = draggedElement.dataset.id;
                const targetElementId = dropTarget.dataset.id;
                player.resolveEnemyAttack(draggedElementId, targetElementId);

            }
        },

        ondropdeactivate(event) {
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });

    setupDraggable('.drag-wrapper.draggable');


    interact('.my-board-card').dropzone({
        accept: '.my.mana.active',
        overlap: 0.75,

        ondropactivate(event) {
            event.target.classList.add('drop-active');
        },

        ondragenter(event) {
            event.target.classList.add('drop-target');
        },

        ondragleave(event) {
            event.target.classList.remove('drop-target');
        },

        ondrop(event) {
            if (!isEnemy) return;

            const dropTarget = event.target;

            if (dropTarget) {

                const targetElementId = dropTarget.dataset.id;
                gameController.manaBoost(targetElementId);

            }
        },

        ondropdeactivate(event) {
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
})



const cardWidth = 240;
const spacing = 40;

const cardPositions = computed(() => {
    const result: { left: number; }[] = [];
    const totalCards = player.board.length;
    const containerWidth = 0.65 * window.innerWidth;

    const totalWidth = totalCards * cardWidth + (totalCards - 1) * spacing;
    let startX = (containerWidth - totalWidth) / 2;

    for (let i = 0; i < totalCards; i++) {
        result.push({
            left: startX + i * (cardWidth + spacing),
        });
    }

    return result;
})




// =============================
// 🧩 Composables
// =============================
// useRoute, useRouter, useStore, useI18n, custom composables, etc.

// =============================
// ⚙️ Compiler Macros
// =============================
// defineProps, defineEmits, defineExpose, etc.

// =============================
// 🪵 Static Variables & Constants
// =============================
// Define constants, enums, non-reactive objects

// =============================
// 🔁 Reactive State
// =============================
// Define refs, reactive(), shallowRef, etc.

// =============================
// 🧮 Computeds & Watchers
// =============================
// Setup computed properties and watchers

// =============================
// 🔧 Methods / Functions
// =============================
// Define functions and internal logic

// =============================
// 🧹 Lifecycle Hooks
// =============================
// onMounted, onUnmounted, etc.


</script>

<style scoped>
.board {
    position: relative;
    background-color: rgba(255, 255, 255, 0.4);
    border: 1px solid white;
    border-radius: 1rem;
    width: 65vw;
    height: 280px;
    padding-block: 20px;
}


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

/* NEW drag wrapper: gets translated directly, but NO transition */
.drag-wrapper {
    will-change: transform;
    transition: none !important;
    width: 170px;
    height: 240px;
    position: relative;
    touch-action: none;
    user-select: none;
}


/* .board-card now only handles rotation */
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

    filter: grayscale(100%) contrast(75%);
}

.empty-placeholder {
    color: black;
    font-weight: bold;
}

img,
div[absolute-inner-text] {
    pointer-events: none;
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
    filter: grayscale(60%) brightness(0.8);
    opacity: 0.6;
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

.destroy-leave-active {
    transition: all 600ms ease-out;
    z-index: 1000;
    pointer-events: none;
}

.destroy-leave-from {
    transform: scale(1) rotate(0deg);
    opacity: 1;
    filter: blur(0px);
}

.destroy-leave-to {
    transform: scale(0.2) rotate(180deg);
    opacity: 0;
    filter: blur(4px);
}
</style>