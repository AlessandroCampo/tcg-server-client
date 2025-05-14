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
    PlayerState,
    ChangePositionPayload,
    ManaBoostPayload,
    CardType,
    Keyword,
    ServerRequest
} from '../../shared/interfaces';
import { gameRules } from '../../shared/gameRules';
import { Card } from '../../shared/Card';
import { useEffect } from './game/effects/useEffect';
import { EffectType } from '../../shared/Effect';
import { cardEffects, drawCard } from './data/cardEffects';

const { activateEffect } = useEffect();

/**
 * Always‐succeeds draw. Returns new state.
 */
export function draw(
    state: GameState,
    { playerId, amount = 1 }: DrawPayload
): EventResult<{ state: GameState }> {
    const st = { ...state };
    const p = st.players[playerId];
    drawCard(p, amount);

    return { success: true, state: st };
}


/**
 * Attempt to play a card. Fails if not your turn, no such card, or insufficient mana.
 */
export function playCard(
    state: GameState,
    { playerId, cardId }: PlayCardPayload
): EventResult<{ card: Card }> {
    const st = structuredClone(state);
    const p = st.players[playerId];

    const [player, opponent] = getPlayersFromState(st, playerId);
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
    if (!card.keywords.includes(Keyword.RUSH)) {
        card.isActive = false;
    }

    if (card.type == CardType.MINION) {
        p.board.push(card);
    }
    p.mana -= card.cost;
    activateEffect(card, EffectType.ON_PLAY, [player, opponent]);




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
        drawnCard = active.deck.splice(0, 1)[0];
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
    opponent.lifePoints = Math.max(opponent.lifePoints - 1, 0);

    card.isActive = false;
    card.isHorizontal = true;

    activateEffect(card, EffectType.ON_ATTACK, [player, opponent]);
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

export function changePosition(
    state: GameState,
    payload: ChangePositionPayload
): EventResult<{ state: GameState }> {

    const { cardId, playerId } = payload;
    const st = structuredClone(state);
    const [player, opponent] = getPlayersFromState(st, playerId);
    const card = player.board.find(c => c.instanceId == cardId);


    if (!card) {
        return { success: false, reason: 'Card not found on the board' };
    }
    const effects = cardEffects[card.name] ?? [];

    const onTapEffect = effects.find(eff => eff.type == EffectType.ON_TAP);





    if (card.isActive && !onTapEffect) {
        return { success: false, reason: 'You can only switch the position of inactive units' };
    }




    if (card.isHorizontal) {
        return { success: false, reason: 'Your minion is already defending...' };
    }

    const successRes: EventResult<{}> = {
        success: true,
        state: st,
    };

    card.isHorizontal = true;
    if (onTapEffect) {

        if (onTapEffect.targets) {
            console.log('asking targets', onTapEffect.validTargets([player, opponent], card));

            return {
                ...successRes,
                waitForClient: {
                    type: ServerRequest.TARGET_SELECTION,
                    validTargets: onTapEffect.validTargets([player, opponent], card),
                    card: card,
                    playerId: playerId,
                    effect: onTapEffect
                },
            };
        }
        onTapEffect.resolver([player, opponent], card);
    }

    return successRes;
}
export function resolveTargetSelection(
    state: GameState,
    payload: ManaBoostPayload
): EventResult<{ state: GameState }> {

    const { cardId, playerId } = payload;
    const st = structuredClone(state);
    const [player] = getPlayersFromState(st, playerId);


    const card = player.board.find(c => c.instanceId == cardId);

    return {
        success: true,
        state: st,
    };
}
export function manaBoost(
    state: GameState,
    payload: ManaBoostPayload
): EventResult<{ state: GameState }> {

    const { cardId, playerId } = payload;
    const st = structuredClone(state);
    const [player] = getPlayersFromState(st, playerId);
    const card = player.board.find(c => c.instanceId == cardId);
    if (!card) {
        return { success: false, reason: 'Card not found on the board' };
    }
    if (player.mana == 0) {
        return { success: false, reason: "You don't have enough mana!" };
    }

    if (!card.attack || !card.defense) {
        return { success: false, reason: "You can only boost units.." };
    }
    if (!card.isActive || card.isHorizontal) {
        return { success: false, reason: "You should only boost units that are ready to attack..." };
    }

    card.attack += 1;
    card.defense += 1;
    player.mana -= 1;

    return {
        success: true,
        state: st,
    };
}


export const getPlayersFromState = (st: GameState, playerId: string): PlayerState[] => {
    const player = st.players[playerId];
    const opponentId = Object.keys(st.players).find(id => id !== playerId);
    if (!opponentId) throw new Error;
    const opponent = st.players[opponentId];
    return [player, opponent];
}