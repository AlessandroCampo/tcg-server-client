<template>
    <div>
        <RippleButton class="bg-emerald-200 switch-turn-button w-[150px] h-[60px] switch-turn-button" v-if="isMyTurn"
            @click="handleClick">
            End
            turn
        </RippleButton>

    </div>


</template>

<script setup lang="ts">
// =============================
// 📦 Imports
// =============================
// Import Vue functions, composables, components, types, etc.

import { Player } from '@/classes/Player';
import RippleButton from '../ui/ripple-button/RippleButton.vue';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameController } from '@/stores/gameController';
// =============================
// 🧩 Composables
// =============================
// useRoute, useRouter, useStore, useI18n, custom composables, etc.

// =============================
// ⚙️ Compiler Macros
// =============================
// defineProps, defineEmits, defineExpose, etc.

interface SwitchTurnButtonProps {
    players: Player[];
}

const { players } = defineProps<SwitchTurnButtonProps>();

const gameController = useGameController();
const { isMyTurn } = storeToRefs(gameController);


const handleClick = () => {
    if (!isMyTurn.value) return;
    gameController.passTurn();
}




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
.switch-turn-button {
    position: absolute;
    right: 5%;
    bottom: 50%;
    transform: translateY(-50%);
}
</style>