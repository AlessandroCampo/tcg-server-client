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



interface HandContainerProps {
    player?: Player;
    isEnemy?: boolean;
}

const { player, isEnemy } = defineProps<HandContainerProps>();
const { isMyTurn } = storeToRefs(useGameController());

onMounted(() => {
    interact('.hand-card.draggable').draggable({
        listeners: {
            start(event) {
                const target = event.target as HTMLElement;

                // Save initial position on the element
                if (!target.dataset.startX || !target.dataset.startY) {
                    target.dataset.startX = '0';
                    target.dataset.startY = '0';
                }

                // Reset position on drag start
                target.dataset.x = target.dataset.startX;
                target.dataset.y = target.dataset.startY;
            },

            move(event) {
                const target = event.target as HTMLElement;

                const x = (parseFloat(target.dataset.x!) || 0) + event.dx;
                const y = (parseFloat(target.dataset.y!) || 0) + event.dy;

                target.style.transform = `translate(${x}px, ${y}px)`;
                target.dataset.x = x.toString();
                target.dataset.y = y.toString();
            },

            end(event) {
                const target = event.target as HTMLElement;


                if (target.dataset.dropped === 'true') {
                    // Don't reset position, just remove the flag for next drag
                    delete target.dataset.dropped;
                    return;
                }

                // Otherwise, reset to hand
                target.style.transition = 'transform 0.2s ease';
                target.style.transform = `translate(0px, 0px)`;
                target.dataset.x = '0';
                target.dataset.y = '0';

                setTimeout(() => {
                    target.style.transition = '';
                }, 200);
            }

        }
    });

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