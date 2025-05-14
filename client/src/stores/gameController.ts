// stores/gameStore.ts
import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'
import { Player } from '@/classes/Player'
import { Card } from '@/classes/Card'
import { GameState, PlayerState, EventType } from 'shared/interfaces'
import { useMultiplayer } from '@/composables/useMultiplayer'
import { useSocket } from '@/composables/useSocket';
import { useRouter } from 'vue-router';
const router = useRouter();


export const useGameController = defineStore('game', () => {
    const { myPlayerId, opponentPlayerId, room, emitEvent } = useMultiplayer();
    const myPlayer = ref<Player | undefined>(undefined)
    const opponentPlayer = ref<Player | undefined>(undefined)
    const currentTurn = ref(0)

    const minions = ref<Card[]>([]);
    const gameState = shallowRef<GameState | undefined>(undefined);
    const players = [myPlayer, opponentPlayer];

    const activePlayer = computed(() => {
        if (!gameState.value) return undefined;
        return [myPlayer.value, opponentPlayer.value].find(
            p => p?.id === gameState.value?.turnPlayerId
        ) as Player | undefined;
    });


    const isMyTurn = computed(() => gameState.value?.turnPlayerId == myPlayerId.value);
    const myPlayerState = ref<PlayerState | undefined>(undefined);
    const oppponentPlayerState = ref<PlayerState | undefined>(undefined);


    function startGame(state: GameState) {
        currentTurn.value = state.turnNumber;
        gameState.value = state;

        if (!myPlayerId.value || !opponentPlayerId.value) {
            throw new Error("Can't start the game")
        }

        myPlayerState.value = state.players[myPlayerId.value];
        oppponentPlayerState.value = state.players[opponentPlayerId.value];

        myPlayer.value = Player.fromState(myPlayerState.value, true, myPlayerId.value);
        opponentPlayer.value = Player.fromState(oppponentPlayerState.value, false, opponentPlayerId.value);

        myPlayer.value.opponent = opponentPlayer.value;
        opponentPlayer.value.opponent = myPlayer.value;



    }

    const playCard = (cardId: string) => {
        emitEvent('play-card', { cardId });
    };

    const directAttack = (cardId: string) => {
        emitEvent('direct-attack', { cardId });
    };

    const minionAttack = (attackingMinionId: string, defendingMinionId: string) => {
        emitEvent('minion-attack', { attackingMinionId, defendingMinionId });
    }

    function passTurn() {
        emitEvent('end-turn');
    }

    function changePosition(cardId: string) {
        emitEvent(
            'change-position', { cardId });
    }
    function manaBoost(cardId: string) {
        emitEvent(
            'mana-boost', { cardId });
    }



    const setGameState = (state: GameState) => {
        gameState.value = state;

        if (!myPlayerId.value || !opponentPlayerId.value) return;

        myPlayerState.value = state.players[myPlayerId.value];
        oppponentPlayerState.value = state.players[opponentPlayerId.value];

        if (myPlayer.value) {
            myPlayer.value.updateFromState(myPlayerState.value);
        }

        if (opponentPlayer.value) {
            opponentPlayer.value.updateFromState(oppponentPlayerState.value);
        }

        console.log(myPlayer.value);
    };


    return {
        myPlayer,
        opponentPlayer,
        currentTurn,
        minions,
        activePlayer,
        isMyTurn,
        startGame,
        passTurn,
        players,
        playCard,
        setGameState,
        directAttack,
        minionAttack,
        changePosition,
        manaBoost

    }
})
