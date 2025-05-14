
import { Card } from "../../../shared/Card";
import { Effect } from "../../../shared/Effect";
import { EffectType } from "../../../shared/Effect";
import { CardType, EventType, GameState, PlayerState } from "../../../shared/interfaces";
import { draw, getPlayersFromState } from "../gameEngine";
import { controlsAnotherMinion, controlsMinionWithNameFragment, isCardTapped } from "../../../shared/conditions";

const dealDamage = () => {

}

interface stats {
    attack: number,
    defense: number
}

export const drawCard = (player: PlayerState, amount: number) => {
    const drawCount = Math.min(amount, player.deck.length);
    player.hand.push(...player.deck.splice(0, drawCount));
}

const dealDirectDamage = (targetPlayerState: PlayerState, amount: number) => {
    targetPlayerState.lifePoints -= amount;
}

const boostStats = (card: Card, { attack, defense }: stats) => {
    if (!card.attack || !card.defense) return;
    card.attack += attack;
    card.defense += defense;
};



const SlaveGoblinEffect = new Effect({

    type: EffectType.ON_PLAY,
    resolver: ([player, opponent]) => {

        dealDirectDamage(opponent, 1);
    }
});

//DEAL 1 to a random enemy unit
const fireBallEffect = new Effect({

    type: EffectType.ON_PLAY,
    resolver: ([player, opponent]) => {

        dealDirectDamage(opponent, 2);
    }
});

const GreedyGolemEffect = new Effect({

    type: EffectType.ON_PLAY,
    resolver: ([player, opponent]) => {

        drawCard(player, 1);
    }
});

const DrunkardGoblinEffect = new Effect({

    type: EffectType.ON_ATTACK,
    resolver: ([player, opponent], card) => {
        dealDirectDamage(opponent, 1);
    },
    condition: (playerStates, card) => {
        if (!card?.defense || card?.defense >= 0) return true;
        return false;
    },
});

const ExploringGoblinEffect = new Effect({

    type: EffectType.ON_PLAY,
    resolver: ([player, opponent], card) => {
        if (card) {
            boostStats(card, { attack: 1, defense: 1 });
        }
    },
    condition: (playerStates, card) => {
        if (!playerStates || !card) return false;
        const [player] = playerStates;

        return controlsMinionWithNameFragment(player.board, 'Goblin', card);
    }

});
const ForgeInitiateEffect = new Effect({

    type: EffectType.ON_TAP,
    targets: true,
    validTargets: ([player, opponent], card) => {
        return player.board.filter(unit => unit.type == CardType.MINION && unit.instanceId !== card?.instanceId);
    },
    resolver: ([player, opponent], card, target) => {

        if (target) {
            boostStats(target, { attack: 2, defense: 1 });
        }
    },
    condition: (playerStates, card) => {

        if (!playerStates || !card) return false;
        const [player] = playerStates;
        if (!isCardTapped(card)) return false;
        return controlsAnotherMinion(player.board, card);
    }

});




export const cardEffects: Record<string, Effect[]> = {
    'Goblin Slave': [SlaveGoblinEffect],
    'Fireball': [fireBallEffect],
    'Greedy Goblin': [GreedyGolemEffect],
    'DrunkenGoblin': [DrunkardGoblinEffect],
    'Goblin Scout': [ExploringGoblinEffect],
    'Forge Initiate': [ForgeInitiateEffect]
};
