// server/src/game/gameState.ts

import {
    EventResult,
    GameState,
    EventFailure,
    DrawPayload,
    PlayCardPayload,
    DirectAttackPayload,
    MinionAttackPayload,
    ChangePositionPayload,
    ManaBoostPayload,
    ClientInputRequest,
    TargetSelectionPayload,
    ServerRequest,
    PlayerState
} from '../../../shared/interfaces';
import {
    draw,
    playCard,
    passTurn,
    directAttack,
    minionAttack,
    changePosition,
    manaBoost,
    resolveTargetSelection,
    getPlayersFromState

} from '../gameEngine';
import { Card } from '@shared/Card';
import { useEffect } from './effects/useEffect';
import { EffectType } from '../../../shared/Effect';

const { activateEffect } = useEffect();

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
    pendingRequest: ClientInputRequest | null;

    constructor(initial: GameState) {
        this.state = initial;
        this.pendingRequest = null;
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

    applyChangePosition(payload: ChangePositionPayload) {
        return applyEngine(this, changePosition, payload);
    }

    applyManaBoost(payload: ManaBoostPayload) {
        return applyEngine(this, manaBoost, payload);
    }

    applyTargetSelection(payload: TargetSelectionPayload) {


        if (!this.pendingRequest || this.pendingRequest.type != ServerRequest.TARGET_SELECTION) {
            return { success: false, reason: 'Did not find pending request' };
        }

        if (this.pendingRequest.playerId !== payload.playerId) {
            return { success: false, reason: 'Requst does not come from the player' };
        }

        //const st = structuredClone(this.state);

        if (this.pendingRequest.effect) {
            const { selectedTargetId, playerId } = payload;

            const [player, opponent] = getPlayersFromState(this.state, playerId);
            const validTargets = this.pendingRequest.effect.validTargets([player, opponent], this.pendingRequest.card);
            const target = validTargets.find(t => t.instanceId == selectedTargetId);
            if (!target) {
                return { success: false, reason: 'Selected card is not valid' };
            }

            const targetFromState = this.findCardInGameState([player, opponent], target.instanceId);
            if (targetFromState) {
                activateEffect(this.pendingRequest.card, this.pendingRequest.effect.type as EffectType, [player, opponent], targetFromState);
                this.pendingRequest = null;
                console.log(this.state.players[playerId].board);
            } else {
                return { success: false, reason: 'Selected card not found' };
            }

        }

        const successRes: EventResult<{}> = {
            success: true,
            state: this.state
        };

        return successRes;

    }

    findCardInGameState(players: PlayerState[], instanceId: string): Card | null {
        for (const player of players) {
            const zones = [player.hand, player.board, player.graveyard];

            for (const zone of zones) {
                const found = zone.find(card => card.instanceId === instanceId);
                if (found) {
                    return found;
                }
            }
        }

        return null;
    }


}


const sessions = new Map<string, GameSession>();

export function createSession(room: string, initial: GameState) {
    sessions.set(room, new GameSession(initial));
}

export function getSession(room: string): GameSession | undefined {
    return sessions.get(room);
}