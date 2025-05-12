<template>
    <div class="board" :class="isEnemy && 'mb-3'">
        <div v-for="(card, i) in player.board" :key="'field-card-' + i" class="board-card-wrapper"
            @dblclick="handleDoubleClick(card)"> <!-- Handle Change positon -->
            <!-- NEW WRAPPER: drag wrapper -->
            <div class="drag-wrapper" :data-id="card.instanceId" :class="[
                isEnemy ? 'enemy-board-card' : 'my-board-card',
                !isEnemy && card.isActive ? 'draggable' : '',


            ]" @dragstart.prevent>
                <div class="board-card" :class="[card.isHorizontal ? 'horizontal' : 'vertical',
                card.isActive ? 'active' : 'inactive'

                ]">
                    <GlareCard :card="card" :show-back="false" :is-enemy="isEnemy" />
                </div>
            </div>
        </div>

        <div v-if="player.board.length === 0" class="empty-placeholder">

        </div>
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
import { onMounted } from 'vue';
import interact from 'interactjs';
import { useGameController } from '@/stores/gameController';
import { validator } from '@shared/validations';
import { EventType } from '@shared/interfaces';
import { setupDraggable } from '@/composables/useDraggable';

const gameController = useGameController();


interface HandContainerProps {
    player: Player,
    isEnemy: boolean
};

const { player, isEnemy } = defineProps<HandContainerProps>();


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

const handleDoubleClick = (card: Card) => {
    if (isEnemy) return;
    gameController.changePosition(card.instanceId);
}





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
    background-color: rgba(255, 255, 255, 0.4);
    /* fixed invalid rgba */
    border: 1px solid white;
    border-radius: 1rem;
    width: 60vw;
    height: 280px;
    padding-block: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 1rem;

}

.board-card-wrapper {
    width: 240px;
    height: 170px;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
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
</style>