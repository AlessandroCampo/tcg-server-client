import { Card } from "./Card";

export interface Effect {
    name: string;
    description: string;
}

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
    REBORN = "reborn"
}


export interface CardParams {
    instanceId: string;
    templateId: string;
    name: string;
    image_url: string;
    attack: number | null;
    defense: number | null;
    cost: number;
    ownerId: string;
    color: Color | "HIDDEN";
    type: CardType | "HIDDEN";
    subtype: SubType | "HIDDEN";
    isActive: boolean;
    isHorizontal: boolean;
    isFoil?: boolean;
    isPlayerControlled?: boolean;
    keywords?: string[];
    effectText?: string;
}


export interface PlayerState {
    deck: Card[]
    hand: Card[]
    board: Card[]
    graveyard: Card[]
    lifePoints: number
    mana: number,
    turnsTaken: number
}
export interface GameState {
    players: Record<string, PlayerState>
    turnPlayerId: string
    turnNumber: number,
    startingPlayerId: string,
    globalTurn: number
}
export interface PlayCardPayload {
    playerId: string;
    cardId: string;
    room: string;
}

export interface DrawPayload {
    playerId: string;
    amount?: number;
    room: string;
}

export interface PassTurnPayload {
    playerId: string;
    room: string;
}

export interface DirectAttackPayload {
    playerId: string;
    room: string;
    cardId: string;
}
export interface MinionAttackPayload {
    playerId: string;
    room: string;
    attackingMinionId: string;
    defendingMinionId: string;
}

// 1) Rename the base interface so it doesn’t collide with the union:
export interface BaseGameEvent {
    type: string;
    playerId: string;
    timestamp?: number;
}

export enum EventType {
    TURN_ENDED = "turn-ended",
    CARD_DRAWN = "card-drawn",
    CARD_PLAYED = "card-played",
    DIRECT_ATTACK = 'direct-attack',
    APPLY_MINION_ATTACK = 'minion-attack'
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

// shared/interfaces.ts

export interface EventFailure {
    success: false;
    reason: string;
}

export type EventResult<T> =
    | ({ success: true; state: GameState } & T)
    | EventFailure;

export type GameEvent =
    | CardPlayedEvent
    | EndTurnEvent
    | CardDrawnEvent
    | DirectAttackEvent
    | MinionAttackEvent


export type MethodReturn<T, K extends keyof T> =
    T[K] extends (...args: any[]) => infer R
    ? R
    : never;