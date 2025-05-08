// shared/gameEngine.ts

import {
    GameState,
    PlayCardPayload,
    DrawPayload,
    CardParams,
    EventResult,
    EventFailure,
    DirectAttackPayload,
    MinionAttackPayload,
    PlayerState
} from '../../shared/interfaces';
import { gameRules } from '../../shared/gameRules';
import { Card } from '../../shared/Card';

/**
 * Always‐succeeds draw. Returns new state.
 */
export function draw(
    state: GameState,
    { playerId, amount = 1 }: DrawPayload
): EventResult<{ state: GameState }> {
    const st = { ...state };
    const p = st.players[playerId];
    const drawCount = Math.min(amount, p.deck.length);
    p.hand.push(...p.deck.splice(0, drawCount));
    return { success: true, state: st };
}

/**
 * Attempt to play a card. Fails if not your turn, no such card, or insufficient mana.
 */
export function playCard(
    state: GameState,
    { playerId, cardId }: PlayCardPayload
): EventResult<{ card: Card }> {
    const st = { ...state };
    const p = st.players[playerId];

    if (st.turnPlayerId !== playerId) {
        return { success: false, reason: 'Not your turn' };
    }

    const idx = p.hand.findIndex(c => c.instanceId === cardId);
    if (idx === -1) {
        return { success: false, reason: 'Card not in hand' };
    }

    const card = p.hand[idx];
    if (p.mana < card.cost) {
        return { success: false, reason: 'Insufficient mana' };
    }

    // all checks passed → play the card
    p.hand.splice(idx, 1);
    card.isActive = false;
    p.board.push(card);
    p.mana -= card.cost;

    return { success: true, state: st, card: card };
}

/**
 * Always‐succeeds turn pass. Advances turn, refills mana, and readies units.
 */
export function passTurn(
    state: GameState
): EventResult<{ drawnCard: Card | undefined }> {
    const st = { ...state };

    st.turnNumber++;
    // switch active player
    st.turnPlayerId = Object.keys(st.players).find(id => id !== st.turnPlayerId)!;

    // increment global turn only after both players have gone
    const isSecondPlayer = st.turnPlayerId !== st.startingPlayerId;
    if (isSecondPlayer) st.globalTurn++;

    // refill mana and ready units
    const active = st.players[st.turnPlayerId];
    active.mana = Math.min(st.globalTurn, gameRules.MAX_MANA);
    active.board = active.board.map(u => ({ ...u, isActive: true, isHorizontal: false }));

    let drawnCard
    if (active.deck.length > 0) {
        drawnCard = active.deck.splice(0)[0];
        active.hand.push(drawnCard);
    }

    return { success: true, state: st, drawnCard };
}

/**
 * Direct attack: already returning an EventResult<{ state; attackingCard; damage }>
 */
export function directAttack(
    state: GameState,
    { playerId, cardId: attackingCardId }: DirectAttackPayload
): EventResult<{ state: GameState; card: Card; damage: number }> {


    const st = structuredClone(state);
    const [player, opponent] = getPlayersFromState(st, playerId);

    if (!opponent) {
        return { success: false, reason: 'No opponent found' };
    }
    const idx = player.board.findIndex(c => c.instanceId === attackingCardId);
    if (idx === -1) {
        return { success: false, reason: 'Card not on board' };
    }

    const card = player.board[idx];
    if (!card.isActive || card.isHorizontal) {
        return { success: false, reason: 'Card has already attacked' };
    }

    if (opponent.board.some(c => c.isHorizontal)) {
        return { success: false, reason: "You must attack the units in defense position first" };
    }



    const damage = card.attack ?? 0;
    opponent.lifePoints = Math.max(opponent.lifePoints - damage, 0);
    card.isActive = false;
    card.isHorizontal = true;
    //player.board[idx] = card;

    return {
        success: true,
        state: st,
        card: card,
        damage
    };
}

export function minionAttack(state: GameState, payload: MinionAttackPayload): EventResult<{ destroyedMinionIds: string[] }> {
    const { attackingMinionId, defendingMinionId, playerId } = payload;
    const st = structuredClone(state);
    const [player, opponent] = getPlayersFromState(st, playerId);

    const attacker = player.board.find(c => c.instanceId == attackingMinionId);
    const defender = opponent.board.find(c => c.instanceId == defendingMinionId);

    if (!attacker || !defender) {
        return { success: false, reason: 'One of the targets is not on the board' };
    }

    if (!attacker.isActive || attacker.isHorizontal) {
        return { success: false, reason: attacker.name + ' is not allowed to attack' };
    }

    if (attacker.attack == null || attacker.defense == null || defender.attack == null || defender.defense == null) {
        return { success: false, reason: "Target dell'attacco non valido" };
    }

    if (!defender.isHorizontal && opponent.board.some(c => c.isHorizontal)) {
        return { success: false, reason: "You must attack the units in defense position first" };
    }


    attacker.defense -= defender.attack;
    defender.defense -= attacker.attack;
    attacker.isActive = false;
    attacker.isHorizontal = true;

    const destroyedMinionIds: string[] = [];
    for (const m of [attacker, defender]) {
        if (m.defense! <= 0) destroyedMinionIds.push(m.instanceId);
    }


    player.board = player.board.filter(c => c.defense! > 0);
    opponent.board = opponent.board.filter(c => c.defense! > 0);

    return {
        success: true,
        state: st,
        destroyedMinionIds
    };

}


const getPlayersFromState = (st: GameState, playerId: string): PlayerState[] => {
    const player = st.players[playerId];
    const opponentId = Object.keys(st.players).find(id => id !== playerId);
    if (!opponentId) throw new Error;
    const opponent = st.players[opponentId];
    return [player, opponent];
}