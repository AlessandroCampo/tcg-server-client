// server/src/game/gameState.ts

import {
    EventResult,
    GameState,
    EventFailure,
    DrawPayload,
    PlayCardPayload,
    DirectAttackPayload,
    MinionAttackPayload
} from '../../../shared/interfaces';
import {
    draw,
    playCard,
    passTurn,
    directAttack,
    minionAttack,

} from '../gameEngine';
import { Card } from '@shared/Card';

export type EngineFn<P, R> = (state: GameState, payload: P) => EventResult<R>;

function applyEngine<P, R>(
    session: GameSession,
    engineFn: EngineFn<P, R>,
    payload: P
): EventResult<R> {
    const result = engineFn(session.state, payload);
    if (result.success) {
        session.state = result.state;
    }
    return result;
}


export class GameSession {
    state: GameState;

    constructor(initial: GameState) {
        this.state = initial;
    }

    applyDraw(payload: DrawPayload) {
        return applyEngine(this, draw, payload);
    }

    applyPlay(payload: PlayCardPayload): EventResult<{ card: Card }> {
        return applyEngine(this, playCard, payload);
    }

    applyPass() {
        // passTurn takes no payload, so we wrap with an unused {}
        return applyEngine(this, (_s) => passTurn(_s), {});
    }

    applyDirectAttack(payload: DirectAttackPayload) {
        return applyEngine(this, directAttack, payload);
    }
    applyMinionAttack(payload: MinionAttackPayload) {
        return applyEngine(this, minionAttack, payload);
    }
}


const sessions = new Map<string, GameSession>();

export function createSession(room: string, initial: GameState) {
    sessions.set(room, new GameSession(initial));
}

export function getSession(room: string): GameSession | undefined {
    return sessions.get(room);
}