import { Card } from "../../../../shared/Card";
import { cardEffects } from "../../data/cardEffects";
import { EffectType } from "../../../../shared/Effect";
import { GameState, PlayerState } from "../../../../shared/interfaces";

export const useEffect = () => {


    const activateEffect = (card: Card, type: EffectType, playerStates: PlayerState[], target?: Card) => {
        const effects = cardEffects[card.name];

        console.log('activate effect', effects);

        if (!effects || !effects.length) return;

        effects.forEach(eff => {
            if (eff.type !== type) return;
            if (eff.condition(playerStates, card)) {
                eff.cost();
                eff.resolver(playerStates, card, target);
            }
        })

    }

    return {
        activateEffect
    };
}