// composables/useMultiplayer.ts
import { ref, onMounted } from 'vue';
import { Card } from '@shared/Card';
import { useSocket } from './useSocket';
import { store } from '@/stores/testStore';
import { CardPlayedEvent, EventType, GameEvent, GameState, ClientInputRequest, ServerRequest, TargetSelectionRequest } from '@shared/interfaces';
import { myRouter } from '@/router';


const { socket } = useSocket();

const room = ref<string | null>(null);
const myPlayerId = ref<string | null>(null);
const opponentPlayerId = ref<string | null>(null);
const isWaiting = ref(false);
const availableTargets = ref<Card[]>([]);
const onTargetSelected = ref<((id: string) => void) | null>(null);


import { useGameController } from '@/stores/gameController';

interface BasePayload {
    room: string;
    playerId: string;
}

let userInputPromise: Promise<any> | null = null;



// NEW: Prevent multiple registrations
let listenersRegistered = false;

export const useMultiplayer = () => {

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
            console.log(myPlayerId.value);
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
                        console.log(event.card);
                        break;
                    case EventType.CARD_PLAYED:
                        const playedCard = new Card({ ...event.card });
                        player.value.playCard(playedCard, state);
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
            if (waitForClient.playerId === myPlayerId.value) {
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


    async function waitForUserInput() {
        if (userInputPromise) {
            const userInput = await userInputPromise;
            return userInput;
        }



    }

    return {
        room,
        isWaiting,
        myPlayerId,
        opponentPlayerId,
        emitEvent,
        availableTargets,
        onTargetSelected
    };
};
