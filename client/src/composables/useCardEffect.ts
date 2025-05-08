
import { Card } from "@/classes/Card";
import { effects } from "@/data/effects";
import { EffectType } from "@/classes/Effect";

export const useCardEffect = () => {

    const activateEffect = (card: Card, type: EffectType) => {
        const effect = effects[card.name];
        if (!effect) return;
        if (card.effectType != type) return;


        if (effect.condition()) {
            effect.cost();
            effect.resolver();
        }
    }



    return {
        activateEffect
    }
}