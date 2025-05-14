// server/src/socket.ts
import { Server, Socket } from 'socket.io';
import { testDecks } from './testDecks';
import { fetchDeckData } from './game/deckService';
import { createSession, getSession } from './game/gameState';
import { shuffle, diceRoll } from './game/gameUtils';
import { gameRules } from '../../shared/gameRules';
import {
    PlayerState,
    GameState,
} from '../../shared/interfaces';

import { initGameMethods } from './mutiplayer/gameMethods';
import { sanitizeGameStateFor } from './mutiplayer/sanitizeGameState';

const waitingQueue: string[] = [];

async function tryMatchmake(socket: Socket): Promise<string | undefined> {
    // Check if there are players waiting in the queue
    if (waitingQueue.length === 0) {
        // Add the player to the waiting queue
        waitingQueue.push(socket.id);
        socket.emit('waiting', { playerId: socket.id });
        console.log(`🏃 Player ${socket.id} is waiting for an opponent`);
        return;
    }

    // If there's an opponent in the queue, match them
    const opponentId = waitingQueue.shift()!; // Get the first player in the queue
    const room = `room-${opponentId}-${socket.id}`;

    // Have both players join the room
    socket.join(room);
    socket.to(opponentId).socketsJoin(room);

    return room;
}

/** Create initial game state, store session, and emit a 'game-start' to each player. */
async function launchGame(room: string, socket: Socket, io: Server) {
    const [a, b] = room.split('-').slice(1);      // [opponentId, thisSocketId]
    const players = [a, b];
    const startingPlayer = players[diceRoll()];

    // build and shuffle decks
    const deckA = shuffle(fetchDeckData(testDecks[0], a));
    const deckB = shuffle(fetchDeckData(testDecks[1], b));


    const initState: GameState = {
        players: {
            [a]: {
                deck: deckA,
                hand: deckA.splice(0, gameRules.STARTING_HAND_SIZE),
                board: [], graveyard: [],
                lifePoints: gameRules.STARTING_LIFE,
                mana: gameRules.STARTING_MANA, turnsTaken: 0
            },
            [b]: {
                deck: deckB,
                hand: deckB.splice(0, gameRules.STARTING_HAND_SIZE),
                board: [], graveyard: [],
                lifePoints: gameRules.STARTING_LIFE,
                mana: gameRules.STARTING_MANA, turnsTaken: 0
            }
        },
        turnPlayerId: startingPlayer,
        startingPlayerId: startingPlayer,
        globalTurn: 1,
        turnNumber: 0
    };

    createSession(room, initState);

    const session = getSession(room);
    if (session) {
        session.pendingRequest = null;
    }


    // notify both
    for (const pid of players) {
        io.to(pid).emit('game-start', {
            room,
            gameState: sanitizeGameStateFor(pid, initState)
        });
    }
}

export function initializeSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log('🔌 player connected:', socket.id);
        socket.emit('connected', { playerId: socket.id });

        // register all game message handlers
        initGameMethods(socket, io);

        // Listen for the 'joinQueue' event to start matchmaking
        socket.on('joinQueue', async () => {
            console.log(`🕹️ Player ${socket.id} wants to join the queue`);
            try {
                const room = await tryMatchmake(socket);
                if (room) {
                    console.log(`🏁 starting game in ${room}`);
                    return launchGame(room, socket, io);
                }
            } catch (err) {
                console.error('Matchmaking error:', err);
            }
        });

        socket.on('leaveQueue', async () => {
            console.log(`🕹️ Player ${socket.id} left the queue :(`);

            const idx = waitingQueue.indexOf(socket.id);

            if (idx !== -1) {
                waitingQueue.splice(idx, 1);
                console.log(`🕹️ Player ${socket.id} successfully removed from the queue`);


                socket.emit('queueLeft', { playerId: socket.id });
            } else {
                console.log(`❗ Player ${socket.id} was not found in the queue`);
            }
        });
    });
}