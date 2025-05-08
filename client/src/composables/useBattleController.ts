import { Card } from "@/classes/Card"
import { Player } from "@/classes/Player";


interface BattleContext {
    attacker: Player;
    defender: Player;
    attackingCard: Card;
    defendingCard: Card;
}

export const useBattleController = () => {
    const resolveBattle = async (ctx: BattleContext) => {
        const { attackingCard, defendingCard } = ctx;

        defendingCard.defense -= attackingCard.attack;
        if (defendingCard.defense <= 0) {
            await defendingCard.destroy();
        }

        attackingCard.isActive = false;
    };

    return { resolveBattle };
};



