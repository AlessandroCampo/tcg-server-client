import { ref, readonly, computed } from 'vue';
import { Player } from '@/classes/Player';
import type { Ref } from 'vue';
import { gameRules } from '@shared/gameRules';
type PlayerIndex = 0 | 1;


/*

export const useGameController = (myPlayer: Ref<Player>, opponentPlayer: Ref<Player>) => {

    const currentTurn = ref(0);
    const playersRefs = [myPlayer, opponentPlayer];
    const activePlayerIndex = ref<PlayerIndex>(0);

    const getActivePlayer = () => {
        return playersRefs[activePlayerIndex.value].value
    };
    const getInactivePlayer = () => playersRefs[1 - activePlayerIndex.value].value;
    const isMyTurn = computed(() => activePlayerIndex.value === 0)

    const diceRoll = () => {
        const myPlayerRoll = Math.floor(Math.random() * 5);
        const enemyPlayerRoll = Math.floor(Math.random() * 5);
        myPlayerRoll > enemyPlayerRoll ? activePlayerIndex.value = 0 : activePlayerIndex.value = 1;
        return activePlayerIndex.value = 0;
    }

    const startGame = () => {

        diceRoll();
        currentTurn.value = 1;
        playersRefs.forEach(pl => {
            pl.value.initRandomDeck();
            pl.value.drawFirstHand();
        });

        const player1 = getActivePlayer();
        const player2 = getInactivePlayer();

        player1.opponent = player2;
        player2.opponent = player1;

        getActivePlayer().mana = 1;


    }
    const passTurn = () => {
        currentTurn.value++;
        activePlayerIndex.value = (1 - activePlayerIndex.value) as PlayerIndex;
        const activePlayer = getActivePlayer();

        if (activePlayer) {

            activePlayer.mana = Math.min(activePlayer.mana + gameRules.MANA_PER_TURN, gameRules.MAX_MANA);
            activePlayer.draw();
        }

    };


    const readonlyCurrentTurn = readonly(currentTurn);

    return { currentTurn: readonlyCurrentTurn, startGame, passTurn, getActivePlayer, getInactivePlayer, isMyTurn }

}

*/