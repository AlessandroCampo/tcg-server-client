import { Server, Socket } from 'socket.io';
import { getSession, GameSession } from '../game/gameState';
import { sanitizeGameStateFor } from './sanitizeGameState';
import {
    EventType,
    GameState,
    PlayCardPayload,
    PassTurnPayload,
    DirectAttackPayload,
    DrawPayload,
    BasePayload,
    MinionAttackPayload,
    ChangePositionPayload,
    ManaBoostPayload,
    TargetSelectionPayload
} from '../../../shared/interfaces';
import { getPlayersFromState } from '../gameEngine';

/**
 * Only the keys of GameSession that map to handler methods
 */
type SessionMethodNames = {
    [K in keyof GameSession]: GameSession[K] extends (payload: infer P) => any ? K : never
}[keyof GameSession];


/**
 * Broadcast the same game-event to all players in the session,
 * sanitizing the state per viewer.
 */
function broadcastEvent(
    io: Server,
    room: string,
    eventType: EventType,
    playerId: string,
    state: GameState,
    extra: Record<string, any> = {}
) {
    for (const viewerId of Object.keys(state.players)) {



        io.to(viewerId).emit('game-event', {
            state: sanitizeGameStateFor(viewerId, state),
            event: {
                type: eventType,
                playerId,
                ...extra
            }
        });

        const [player, opponent] = getPlayersFromState(state, viewerId);
        if (opponent.lifePoints == 0) {
            console.log('game-over');
            io.to(room).emit('game-over', {
                winnerId: viewerId
            })
        }
    }
}

/**
 * Register a socket event that invokes a GameSession method and broadcasts on success.
 */
function registerHandler<
    Payload extends { room: string; playerId: string },
    MethodName extends SessionMethodNames,
    R extends ReturnType<GameSession[MethodName]>
>(
    socket: Socket,
    io: Server,
    message: string,
    methodName: MethodName,
    eventType: EventType,
    extractExtra?: (res: Extract<R, { success: true }>) => Record<string, any>
) {
    socket.on(message, (payload: Payload) => {
        console.log(`➡️ ${message} from ${socket.id}`);

        const session = getSession(payload.room);
        console.log(session, payload.room);
        if (!session) return;

        if (session.pendingRequest && eventType !== EventType.TARGET_SELECTION) {
            console.warn(`${message} failed: waiting for pending request`);
            return;
        }

        const result = (session[methodName] as (p: any) => R)(payload);
        if (!result.success) {
            console.warn(`${message} failed:`, (result as any).reason);
            return;
        }

        const extra = extractExtra ? extractExtra(result as Extract<R, { success: true }>) : {};

        const successResult = result as Extract<R, { success: true }>;

        if (successResult.waitForClient) {
            extra.waitForClient = successResult.waitForClient;
            session.pendingRequest = successResult.waitForClient;
        }
        broadcastEvent(io, payload.room, eventType, payload.playerId, session.state, extra);
    });
}

/**
 * Initialize all game-related socket handlers on connection.
 */
export function initGameMethods(socket: Socket, io: Server) {
    registerHandler<PlayCardPayload, 'applyPlay', ReturnType<GameSession['applyPlay']>>(
        socket,
        io,
        'play-card',
        'applyPlay',
        EventType.CARD_PLAYED,

        res => ({ card: res.card })
    );

    registerHandler<PassTurnPayload, 'applyPass', ReturnType<GameSession['applyPass']>>(
        socket,
        io,
        'end-turn',
        'applyPass',
        EventType.TURN_ENDED
    );

    registerHandler<DirectAttackPayload, 'applyDirectAttack', ReturnType<GameSession['applyDirectAttack']>>(
        socket,
        io,
        'direct-attack',
        'applyDirectAttack',
        EventType.DIRECT_ATTACK,
        res => ({ damage: res.damage, card: res.card })
    );

    registerHandler<DrawPayload, 'applyDraw', ReturnType<GameSession['applyDraw']>>(
        socket,
        io,
        'draw-card',
        'applyDraw',
        EventType.CARD_DRAWN
    );

    registerHandler<MinionAttackPayload, 'applyMinionAttack', ReturnType<GameSession['applyMinionAttack']>>(
        socket,
        io,
        'minion-attack',
        'applyMinionAttack',
        EventType.CARD_DRAWN
    );
    registerHandler<ChangePositionPayload, 'applyChangePosition', ReturnType<GameSession['applyChangePosition']>>(
        socket,
        io,
        'change-position',
        'applyChangePosition',
        EventType.CHANGE_POSITION
    );
    registerHandler<ManaBoostPayload, 'applyManaBoost', ReturnType<GameSession['applyManaBoost']>>(
        socket,
        io,
        'mana-boost',
        'applyManaBoost',
        EventType.MANA_BOOST
    );
    registerHandler<TargetSelectionPayload, 'applyTargetSelection', ReturnType<GameSession['applyTargetSelection']>>(
        socket,
        io,
        'select-target',
        'applyTargetSelection',
        EventType.TARGET_SELECTION
    );
}
