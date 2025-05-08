import { gameRules } from '@shared/gameRules';

import { useCardEffect } from "@/composables/useCardEffect";
import { useGameController } from "@/stores/gameController";
import { EffectType } from "./Effect";
import { CardType, PlayerState, GameState } from "@shared/interfaces";
import { Card } from '@shared/Card';
const { activateEffect } = useCardEffect();



export class Player {

    id: string;
    board: Card[];
    hand: Card[];
    deck: Card[];
    grave: Card[];
    lifePoints: number;
    mana: number;
    isActiveTurn: boolean;
    opponent: Player | undefined;
    isMyPlayer: boolean;

    constructor(isMyPlayer: boolean, id: string) {

        this.id = id;
        this.deck = [];
        this.board = [];
        this.hand = [];
        this.grave = [];
        this.lifePoints = 10;
        this.mana = 0;
        this.isActiveTurn = false;
        this.opponent = undefined;
        this.isMyPlayer = isMyPlayer;
    }

    static fromState(state: PlayerState, isMyPlayer: boolean, playerId: string): Player {
        const player = new Player(isMyPlayer, playerId);
        player.deck = [...state.deck.map(c => {
            const newCard = new Card({ ...c });
            return newCard;
        })];
        player.hand = [...state.hand.map(c => {
            const newCard = new Card({ ...c });
            return newCard;
        })];

        player.lifePoints = state.lifePoints;
        player.mana = state.mana;
        return player;
    }

    updateFromState(state: PlayerState) {
        this.deck = state.deck.map(c => new Card({ ...c }));
        this.hand = state.hand.map(c => new Card({ ...c }));
        this.grave = state.graveyard.map(c => new Card({ ...c }));
        this.board = state.board.map(c => new Card({ ...c }));
        this.lifePoints = state.lifePoints;
        this.mana = state.mana;
    }


    drawFirstHand(): void {
        const startingHand = this.deck.splice(0, gameRules.STARTING_HAND_SIZE);
        this.hand = startingHand;
    }

    draw(amount = 1): void {

        const drawCount = Math.min(amount, this.deck.length);
        const drawnCards = this.deck.splice(0, drawCount);
        this.hand.push(...drawnCards);
    }

    async resolveEnemyAttack(attackinMinionId: string, defendingMinionId: string) {
        if (!this.opponent) return false;
        const gc = useGameController();

        const attacker = this.opponent.board.find(c => c.instanceId === attackinMinionId);
        const defender = this.board.find(c => c.instanceId === defendingMinionId);

        if (!attacker || !defender) return false;

        gc.minionAttack(attackinMinionId, defendingMinionId);

    }

    /* 

  initRandomDeck(): void {
        this.deck = [];
        const { minions } = useGameController();

        if (!minions) return;

        while (this.deck.length < gameRules.MAX_DECK_SIZE) {
            const randomCard = minions[Math.floor(Math.random() * minions.length)];
            const newCard = Card.cloneFrom(randomCard, {
                isPlayerControlled: this.isMyPlayer,
                isFoil: true,
            });
            this.deck.push(newCard);
        }
    }

      
    }

    */



    async playCard(card: Card, state: GameState): Promise<void> {

        this.hand = this.hand.filter(el => el.instanceId !== card.instanceId);
        if (card.type == CardType.MINION) {
            this.board.push(card);
        }
        this.mana = state.players[this.id].mana;
        activateEffect(card, EffectType.ON_PLAY);

    }







}
