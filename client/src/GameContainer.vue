<script setup lang="ts">

import SwitchTurnButton from './components/game/SwitchTurnButton.vue';
import PlayerArea from './components/game/PlayerArea.vue';

import { useMultiplayer } from './composables/useMultiplayer';
import { useGameController } from './stores/gameController';
import { storeToRefs } from 'pinia';
import QueueButton from './components/misc/QueueButton.vue';

const { isWaiting, availableTargets } = useMultiplayer();
const store = useGameController();
const { myPlayer, opponentPlayer, isMyTurn } = storeToRefs(store);

</script>

<template>
  <div v-if="!isWaiting && myPlayer && opponentPlayer" class="canvas overflow-hidden bg-slate-600"
    :class="availableTargets.length && 'waiting-action-mode'" :style="'back'">
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
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  background-image: url('./assets/images/playmat.jpg');
  background-size: cover;
  background-position: center;
}

.waiting-action-mode {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.3);
  height: 100vh;
  width: 100vw;
  z-index: 1;

}
</style>
