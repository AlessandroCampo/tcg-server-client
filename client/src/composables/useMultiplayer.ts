// composables/useMultiplayer.ts
import { ref, onMounted } from 'vue';
import { Card } from '@shared/Card';
import { useSocket } from './useSocket';
import { store } from '@/stores/testStore';
import { CardPlayedEvent, EventType, GameEvent, GameState } from '@shared/interfaces';

const { socket } = useSocket();

const room = ref<string | null>(null);
const myPlayerId = ref<string | null>(null);
const opponentPlayerId = ref<string | null>(null);
const isWaiting = ref(true);
import { useGameController } from '@/stores/gameController';

interface BasePayload {
    room: string;
    playerId: string;
}


// NEW: Prevent multiple registrations
let listenersRegistered = false;

export const useMultiplayer = () => {

    const gameController = useGameController();

    onMounted(() => {
        if (listenersRegistered) return;

        socket.on('waiting', (data) => {
            isWaiting.value = true;
            myPlayerId.value = data.playerId;
            console.log('waiting', data, data.playerId);
        });

        socket.on('connected', (data) => {
            myPlayerId.value = data.playerId;
        });

        socket.on('game-start', (data) => {
            room.value = data.room;
            isWaiting.value = false;
            console.log('game-data', data);
            console.log("Game started on room: " + data.room);
            opponentPlayerId.value = Object.keys(data.gameState.players).find(id => id !== myPlayerId.value)!;
            console.log(opponentPlayerId.value);
            gameController.startGame(data.gameState);
        });

        socket.on('game-event', ({ event, state }: { event: GameEvent, state: GameState }) => {

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


                    // …etc
                }
            }

            gameController.setGameState(state);


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









    return {
        room,
        isWaiting,
        myPlayerId,
        opponentPlayerId,
        emitEvent
    };
};
