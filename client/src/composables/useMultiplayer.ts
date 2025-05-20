// composables/useMultiplayer.ts
import { ref, onMounted, nextTick } from 'vue';
import { Card } from '@shared/Card';
import { useSocket } from './useSocket';
import { store } from '@/stores/testStore';
import { CardPlayedEvent, EventType, GameEvent, GameState, ClientInputRequest, ServerRequest, TargetSelectionRequest } from '@shared/interfaces';
import { myRouter } from '@/router';
import { useAnimator } from './useAnimator';
const { animateCardToBoard, animateAttack } = useAnimator();



const room = ref<string | null>(null);
const myPlayerId = ref<string | null>('');
const opponentPlayerId = ref<string | null>(null);
const isWaiting = ref(false);
const availableTargets = ref<Card[]>([]);
const onTargetSelected = ref<((id: string) => void) | null>(null);
const destroyedCardsIds = ref<(String[])>([]);

import { useGameController } from '@/stores/gameController';
import gsap from 'gsap';
import { sleep } from '@/utils';

interface BasePayload {
    room: string;
    playerId: string;
}

let userInputPromise: Promise<any> | null = null;



// NEW: Prevent multiple registrations
let listenersRegistered = false;

export const useMultiplayer = () => {
    const { socket } = useSocket();
    const gameController = useGameController();

    onMounted(() => {
        if (listenersRegistered) return;

        socket.on('waiting', (data) => {
            isWaiting.value = true;
            myPlayerId.value = data.playerId;
            console.log(myPlayerId.value);
        });

        socket.on('connected', (data) => {
            myPlayerId.value = data.playerId;
            console.log('connected');
            console.log(myPlayerId.value);

        });

        socket.on('game-start', (data) => {
            room.value = data.room;
            isWaiting.value = false;
            console.log("Game started on room: " + data.room);
            console.log(data.gameState);
            opponentPlayerId.value = Object.keys(data.gameState.players).find(id => id !== myPlayerId.value)!;
            gameController.startGame(data.gameState);
            myRouter.push('game');

        });

        socket.on('game-over', (data) => {
            room.value = null;
            console.log(data, 'game-over', myPlayerId.value);

            const outcome = data.winnerId == myPlayerId.value ? 'winner' : 'loser';
            console.log(outcome);
            return myRouter.push({ name: 'game-over', params: { outcome } });
        })

        socket.on('game-event', async ({ event, state }: { event: GameEvent, state: GameState }) => {

            const player = gameController.players.find(pl => pl.value?.id == event.playerId);

            console.log("Event " + event.type + "emitted by " + event.playerId);
            console.log(event, state);

            if (player && player.value) {
                switch (event.type) {
                    case EventType.DIRECT_ATTACK:
                        await animateAttack(event.card, 'base');
                        break;
                    case EventType.CARD_PLAYED:
                        const playedCard = new Card({ ...event.card });
                        player.value.playCard(playedCard, state);
                        await animateCardToBoard(playedCard);
                        await sleep(0.5);
                        break;

                    case EventType.APPLY_MINION_ATTACK:
                        destroyedCardsIds.value = event.destroyedCardIds;
                        await animateAttack(event.attacker, event.defender);
                        destroyedCardsIds.value = [];
                        break;


                    case EventType.TURN_ENDED:
                        //emitEvent('turn-start');
                        break;
                    case EventType.CARD_DRAWN:
                        // hand.push(event.card)
                        break;
                    case EventType.TARGET_SELECTION:
                        availableTargets.value = [];
                        onTargetSelected.value = null;
                        break;

                    case EventType.REROLL:
                        player.value.hand = player.value.hand.filter(c => c.instanceId != event.rerolledCardId);
                        await nextTick();
                        await sleep(1);

                        break;

                }
            }

            gameController.setGameState(state);

            if (event.waitForClient) {
                console.log(event.waitForClient);
                switch (event.waitForClient.type) {
                    case ServerRequest.TARGET_SELECTION: {
                        await handleTargetSelection(event.waitForClient);
                    }

                }

            }


        });

        listenersRegistered = true;
    })

    function emitEvent<T extends object>(event: string, data?: T) {
        console.log(event, room.value, myPlayerId.value);
        if (!room.value || !myPlayerId.value) return;

        console.log('emitting event: ' + event);
        socket.emit(event, {
            ...data,
            room: room.value,
            playerId: myPlayerId.value
        });
    }



    function handleTargetSelection(waitForClient: TargetSelectionRequest) {
        return new Promise((resolve) => {
            console.log(waitForClient.playerId, myPlayerId.value);
            if (waitForClient.playerId == myPlayerId.value) {
                availableTargets.value = waitForClient.validTargets;

                // Assign a handler to be used by the card click
                onTargetSelected.value = (cardId: string) => {
                    emitEvent('select-target', {
                        selectedTargetId: cardId,
                        type: EventType.TARGET_SELECTION
                    });

                    //availableTargets.value = [];
                    //onTargetSelected.value = null; // clear the handler
                    resolve({ selectedTargetId: cardId });
                };
            } else {
                // show waiting UI if needed
            }
        });
    }



    return {
        room,
        isWaiting,
        myPlayerId,
        opponentPlayerId,
        emitEvent,
        availableTargets,
        onTargetSelected,
        destroyedCardsIds
    };
};
