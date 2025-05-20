<template>
    <div class="relative w-[120px] h-[120px] base" :class="isEnemy ? 'droppable enemy' : 'my'">
        <svg class="absolute top-0 left-0" width="120" height="120">
            <circle class="text-gray-300" stroke="currentColor" stroke-width="10" fill="transparent" r="50" cx="60"
                cy="60" />
            <circle :class="ringColor" stroke="currentColor" stroke-width="10" fill="transparent" r="50" cx="60" cy="60"
                stroke-linecap="round" :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset"
                transform="rotate(-90 60 60)" style="transition: stroke-dashoffset 0.5s ease" />
        </svg>
        <div class="absolute top-1/2 left-1/2 w-[80px] h-[80px] rounded-full  transform -translate-x-1/2 -translate-y-1/2"
            style="border: 2px solid red">
            <img :src="imageUrl" alt="base" class="object-cover h-full w-full rounded-full" />
            <div class="absolute top-1/2 left-1/2 rounded-full  transform -translate-x-1/2 -translate-y-1/2"
                v-show="myPlayer.shield">
                🛡️
            </div>
        </div>

        <div
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-bold pointer-events-none drop-shadow">
            {{ displayedValue }}
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import base from '@/assets/images/cards/base.jpg';
import { gameRules } from '@shared/gameRules';
import interact from 'interactjs';
import { Player } from '@/classes/Player';
import { useGameController } from '@/stores/gameController';

const gc = useGameController();

const props = defineProps<{
    value: number;
    image?: string;
    isEnemy: boolean;
    enemyPlayer: Player;
    myPlayer: Player;
}>();

const radius = 50;
const circumference = 2 * Math.PI * radius;
const acceptedClass = props.isEnemy ? 'my-board-card.draggable' : 'enemy-board-card.draggable';

const imageUrl = ref(props.image || base);

// Controlled display value for animation
const displayedValue = ref(props.value);


const bindDrop = () => {
    if (!props.isEnemy) return;
    console.log('binding');
    interact('.base.droppable')
        .dropzone({
            accept: '.draggable.my-board-card',
            ondrop: function (event) {
                if (!props.isEnemy) return;
                const draggedElement = event.relatedTarget;
                if (draggedElement) {
                    const droppedId = draggedElement.dataset.id;
                    //const playedCard = player.playCard(droppedId);
                    const attackingCard = props.enemyPlayer.board.find(c => c.instanceId == droppedId);
                    if (attackingCard) gc.directAttack(droppedId);
                }
            }
        })
        .on('dropactivate', function (event) {
            event.target.classList.add('drop-activated')
        })
}

onMounted(() => {
    if (props.isEnemy) bindDrop();

});




watch(
    () => props.value,
    (newVal) => {
        animateValue(displayedValue.value, newVal);
    }
);

function animateValue(current: number, target: number) {
    if (current === target) return;
    const step = current > target ? -1 : 1;
    const interval = setInterval(() => {
        if (displayedValue.value === target) {
            clearInterval(interval);
        } else {
            displayedValue.value += step;
        }
    }, 50);
}

const progress = computed(() => {
    return Math.min(displayedValue.value / gameRules.STARTING_LIFE, 1);
});

const dashOffset = computed(() => {
    return circumference * (1 - progress.value);
});

// Dynamic color based on HP
const ringColor = computed(() => {
    const hp = displayedValue.value;
    if (hp <= 4) return 'text-red-500';
    if (hp <= gameRules.STARTING_LIFE / 2) return 'text-yellow-400';
    return 'text-green-500';
});
</script>

<style scoped>
svg {
    transform: rotate(0deg);
}
</style>