<template>
    <div :class="['player-area', isEnemy ? 'enemy' : 'my', 'flex-col', 'ga-5']" v-if="myPlayer && enemyPlayer">

        <div class="deck-container" :class="isEnemy ? 'enemy' : 'my'">
            <div class="text-black">

            </div>
            <DeckContainer :cards-amount="myPlayer.deck.length" :is-enemy="isEnemy" />
        </div>

        <div class="mana-container" :class="isEnemy ? 'enemy' : 'my'">
            <div v-if="isEnemy">
                <LeaderHealthCircle :value="myPlayer.lifePoints" :is-enemy="true" :enemy-player="enemyPlayer"
                    :my-player="myPlayer" />
            </div>
            <div class="flex gap-2">

                <ManaIcon v-for="n in gameRules.MAX_MANA" :key="n" :is-active="n <= myPlayer.mana" :class="[isEnemy ? 'enemy' : 'my',
                n <= myPlayer.mana ? 'active' : ''
                ]" class="mana" />
            </div>
            <div v-if="!isEnemy">
                <LeaderHealthCircle :value="myPlayer.lifePoints" :is-enemy="false" :enemy-player="enemyPlayer"
                    :my-player="myPlayer" />
            </div>
        </div>




        <div class="board-hand" :class="isEnemy ? 'enemy' : 'my'">
            <div class="board-container">
                <Board :player="myPlayer" :is-enemy="isEnemy" />
            </div>
        </div>
        <div class="hand-container" :class="isEnemy ? 'enemy' : 'my'">
            <HandContainer :player="myPlayer" :is-enemy="isEnemy" />
        </div>



    </div>
</template>


<script setup lang="ts">

import HandContainer from './HandContainer.vue';
import Board from './Board.vue';
import LeaderHealthCircle from './LeaderHealthCircle.vue';
import DeckContainer from './DeckContainer.vue';
import ManaIcon from '../misc/ManaIcon.vue';
import { gameRules } from '@shared/gameRules';
import { Player } from '@/classes/Player';
import { onMounted } from 'vue';
import { useMultiplayer } from '@/composables/useMultiplayer';

const { myPlayerId } = useMultiplayer();

import { setupDraggable } from '@/composables/useDraggable';

const props = defineProps({
    myPlayer: Player,
    enemyPlayer: Player,
    isEnemy: Boolean
});

onMounted(() => {
    setupDraggable('.my.mana.active');
});

</script>

<style lang="css" scoped>
.player-area {
    overflow: hidden !important;
}

.mana-container {
    position: absolute;
    color: white;
    font-size: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.board-hand {
    display: flex;
    flex-direction: column;
}

.board-hand.enemy {
    flex-direction: column-reverse !important;
}

.mana-container.my {
    bottom: 20px;
    left: 30px;
}

.mana-container.enemy {
    top: 20px;
    right: 30px;
}

.deck-container {
    position: absolute;

}

.deck-container.enemy {
    top: 50px;
    transform: rotate(30deg);
    left: 75px;
}

.deck-container.my {
    bottom: 50px;
    transform: rotate(-30deg);
    right: 75px;
}

.hand-container {
    display: flex;
    justify-content: center;
    max-width: 65vw;
    overflow: visible;
    position: absolute;
    height: 240px;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
}

.hand-container.enemy {
    top: -15%;
}

.hand-container.my {
    bottom: 0%;
    height: 240px;
    width: 100%;
}



.board-container {
    transform: translateY(-40%);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
}


.enemy .board-container {
    top: 15%;
}

.my .board-container {
    top: 45%;
}



.player-area {
    display: flex;
}
</style>