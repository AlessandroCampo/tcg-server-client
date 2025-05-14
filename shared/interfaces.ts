import { Card } from "./Card";
import { Effect } from "./Effect";


export enum CardType {
    MINION = "MINION",
    SPELL = "SPELL",
    TRAP = "TRAP"
}

export enum SubType {
    CONTINOUS = "CONTINOUS",
    EQUIP = "EQUIP"
}

export enum Color {
    RED = "RED",
    BLUE = "BLUE",
    BLACK = "BLACK",
    GREEN = "GREEN",
    YELLOW = "YELLOW",
    BROWN = "BROWN",
    WHITE = "WHITE"
}

export enum Keyword {
    REBORN = "Reborn",
    RUSH = 'Rush',
    UNCHAINED = 'Unchained'
}


export interface CardParams {
    templateId: string;
    name: string;
    attack: number | null;
    defense: number | null;
    cost: number;
    color: Color | "HIDDEN";
    type: CardType | "HIDDEN";
    subtype: SubType | "HIDDEN" | null;
    keywords: Keyword[];
    effectText?: string;
}


export interface PlayerState {
    deck: Card[];
    hand: Card[];
    board: Card[];
    graveyard: Card[];
    lifePoints: number;
    mana: number;
    turnsTaken: number;
}

export interface GameState {
    players: Record<string, PlayerState>;
    turnPlayerId: string;
    turnNumber: number;
    startingPlayerId: string;
    globalTurn: number;
}

export interface BasePayload {
    room: string;
    playerId: string;
    eventType: EventType;

}

export interface PlayCardPayload extends BasePayload {
    eventType: EventType.CARD_PLAYED;
    cardId: string;
}

export interface DrawPayload extends BasePayload {
    eventType: EventType.CARD_DRAWN;
    amount?: number;
}

export interface PassTurnPayload extends BasePayload {
    eventType: EventType.TURN_ENDED;
}

export interface DirectAttackPayload extends BasePayload {
    eventType: EventType.DIRECT_ATTACK;
    cardId: string;
}

export interface MinionAttackPayload extends BasePayload {
    eventType: EventType.APPLY_MINION_ATTACK;
    attackingMinionId: string;
    defendingMinionId: string;
}
export interface ChangePositionPayload extends BasePayload {
    eventType: EventType.CHANGE_POSITION;
    cardId: string;
}
export interface ManaBoostPayload extends BasePayload {
    eventType: EventType.MANA_BOOST;
    cardId: string;
}
export interface TargetSelectionPayload extends BasePayload {
    eventType: EventType.MANA_BOOST;
    selectedTargetId: string;
}
// 1) Rename the base interface so it doesn’t collide with the union:
export interface BaseGameEvent {
    type: string;
    playerId: string;
    timestamp?: number;
    waitForClient?: ClientInputRequest;
}


export enum EventType {
    TURN_ENDED = "turn-ended",
    CARD_DRAWN = "card-drawn",
    CARD_PLAYED = "card-played",
    DIRECT_ATTACK = 'direct-attack',
    APPLY_MINION_ATTACK = 'minion-attack',
    CHANGE_POSITION = 'change-position',
    MANA_BOOST = 'mana-boost',
    GAME_OVER = "game-over",
    TARGET_SELECTION = 'target-selection'
}


// 2) Give each specific event its correct literal, and only the fields it needs:
export interface CardPlayedEvent extends BaseGameEvent {
    type: EventType.CARD_PLAYED;
    card: Card;
}

export interface EndTurnEvent extends BaseGameEvent {
    type: EventType.TURN_ENDED;
    nextPlayerId: string;
    drawnCard?: Card | undefined;
}

export interface CardDrawnEvent extends BaseGameEvent {
    type: EventType.CARD_DRAWN;
    card: Card | undefined;
}
export interface DirectAttackEvent extends BaseGameEvent {
    type: EventType.DIRECT_ATTACK;
    card: Card;
    damage: Number;
}
export interface MinionAttackEvent extends BaseGameEvent {
    type: EventType.APPLY_MINION_ATTACK;
    destroyedCardIds: string[]
}
export interface ChangePositionEvent extends BaseGameEvent {
    type: EventType.CHANGE_POSITION;
    card: Card
}
export interface GameOverEvent extends BaseGameEvent {
    type: EventType.GAME_OVER;
    winnerId: string
}
export interface TargetSelectionEvent extends BaseGameEvent {
    type: EventType.TARGET_SELECTION;
}

// shared/interfaces.ts

export interface EventFailure {
    success: false;
    reason: string;
}

export interface ValidatorResult {
    success: boolean,
    reason?: string
}

export enum ServerRequest {
    TARGET_SELECTION = 'TARGET_SELECTION'
}

export type ClientInputRequest =
    | TargetSelectionRequest
    | SomeOtherClientPrompt; // extend as needed

export interface TargetSelectionRequest {
    type: ServerRequest.TARGET_SELECTION;
    validTargets: Card[];
    card: Card;
    effect: Effect;
    playerId: string;
}

// Example for future-proofing:
export interface SomeOtherClientPrompt {
    type: 'CHOOSE_FROM_OPTIONS';
    options: string[];
}

export type EventResult<T> =
    | ({
        success: true;
        state: GameState;
        waitForClient?: ClientInputRequest;
    } & T)
    | EventFailure;


export type GameEvent =
    | CardPlayedEvent
    | EndTurnEvent
    | CardDrawnEvent
    | DirectAttackEvent
    | MinionAttackEvent
    | ChangePositionEvent
    | GameOverEvent
    | TargetSelectionEvent


export type MethodReturn<T, K extends keyof T> =
    T[K] extends (...args: any[]) => infer R
    ? R
    : never;