<script setup lang="ts">

import SwitchTurnButton from './components/game/SwitchTurnButton.vue';
import PlayerArea from './components/game/PlayerArea.vue';

import { useMultiplayer } from './composables/useMultiplayer';
import { useGameController } from './stores/gameController';
import { storeToRefs } from 'pinia';
import QueueButton from './components/misc/QueueButton.vue';

const { isWaiting } = useMultiplayer();
const store = useGameController();
const { myPlayer, opponentPlayer, isMyTurn } = storeToRefs(store);

</script>

<template>
  <div v-if="!isWaiting && myPlayer && opponentPlayer" class="canvas overflow-hidden bg-slate-600">
    <!-- Enemy side -->
    <PlayerArea :my-player="opponentPlayer" :enemy-player="myPlayer" :is-enemy="true" />

    <!-- Switch turn button between zones -->
    <SwitchTurnButton :players="[myPlayer, opponentPlayer]" v-if="isMyTurn" />

    <!-- Ally side -->
    <PlayerArea :my-player="myPlayer" :enemy-player="opponentPlayer" :is-enemy="false" />
  </div>

</template>


<style scoped>
.canvas {
  height: 100dvh;
  width: 100dvw;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  background-image: url('./assets/images/playmat.jpg');
  background-size: cover;
  background-position: 10px;
}
</style>
