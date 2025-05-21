import { gameRules } from '@shared/gameRules';

import { useGameController } from "@/stores/gameController";
import { CardType, PlayerState, GameState } from "@shared/interfaces";
import { Card } from '@shared/Card';

export class Player {

    id: string;
    board: Card[];
    hand: Card[];
    deck: Card[];
    grave: Card[];
    originalCards: Card[];
    lifePoints: number;
    mana: number;
    isActiveTurn: boolean;
    opponent: Player | undefined;
    isMyPlayer: boolean;
    shield: boolean;
    bloodThirst: boolean;

    constructor(isMyPlayer: boolean, id: string) {

        this.id = id;
        this.deck = [];
        this.board = [];
        this.hand = [];
        this.grave = [];
        this.originalCards = [];
        this.lifePoints = 10;
        this.mana = 0;
        this.isActiveTurn = false;
        this.opponent = undefined;
        this.isMyPlayer = isMyPlayer;
        this.bloodThirst = false;
        this.shield = true;
    }

    static fromState(state: PlayerState, isMyPlayer: boolean, playerId: string): Player {
        const player = new Player(isMyPlayer, playerId);
        player.deck = [...state.deck.map(c => {
            const newCard = new Card({ ...c });
            return newCard;
        })];
        player.originalCards = player.deck;
        player.hand = [...state.hand.map(c => {
            const newCard = new Card({ ...c });
            return newCard;
        })];

        player.lifePoints = state.lifePoints;
        player.mana = state.mana;
        return player;
    }



    updateFromState(state: PlayerState) {
        this.patchZone(this.deck, state.deck);
        this.patchZone(this.hand, state.hand);
        this.patchZone(this.grave, state.graveyard);
        this.patchZone(this.board, state.board);

        this.lifePoints = state.lifePoints;
        this.mana = state.mana;
        this.bloodThirst = state.bloodThirst;
        this.shield = state.shield;
    }

    // Patch a card zone in-place by instanceId
    private patchZone(localZone: Card[], serverZone: Card[]) {
        const serverMap = new Map(serverZone.map(c => [c.instanceId, c]));

        // Remove any cards not in server state
        for (let i = localZone.length - 1; i >= 0; i--) {
            const card = localZone[i];
            if (!serverMap.has(card.instanceId)) {
                localZone.splice(i, 1);
            }
        }

        // Update or insert cards, maintaining correct order
        for (let i = 0; i < serverZone.length; i++) {
            const serverCard = serverZone[i];
            const index = localZone.findIndex(c => c.instanceId === serverCard.instanceId);

            if (index !== -1) {
                // Update existing card in place
                Object.assign(localZone[index], serverCard);

                // Reorder if necessary
                if (index !== i) {
                    const [card] = localZone.splice(index, 1);
                    localZone.splice(i, 0, card);
                }
            } else {
                // Insert new card
                localZone.splice(i, 0, new Card({ ...serverCard }));
            }
        }
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



    async playCard(card: Card, state: GameState): Promise<void> {

        this.hand = this.hand.filter(el => el.instanceId !== card.instanceId);
        if (card.type == CardType.MINION) {
            this.board.push(card);
        }

    }







}
