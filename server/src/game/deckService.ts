import { prisma } from '../prismaClient';
import { CardParams } from '../../../shared/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { testDecks } from '../testDecks';
import { Keyword } from 'src/generated/prisma';
import { Card as dbCard } from 'src/generated/prisma';
import { Card } from '@shared/Card';
import { cardEffects } from '../data/cardEffects';
import { EffectType } from '../../../shared/Effect';


export function fetchDeckData(
    deckList: { card: CardParams; quantity: number }[],
    playerId: string
): Card[] {


    const fullDeck: Card[] = [];



    for (const { card, quantity } of deckList) {

        const effects = cardEffects[card.name] ?? [];

        const base: Omit<Card, 'instanceId'> = {
            templateId: card.templateId,
            name: card.name,
            image_url: `${process.env.BASE_URL}/uploads/${card.templateId}.jpg`,
            attack: card.attack,
            originalAttack: card.attack,

            defense: card.defense,
            originalDefense: card.defense,
            cost: card.cost,
            originalCost: card.cost,
            color: card.color as any,
            type: card.type as any,
            subtype: card.subtype as any,
            keywords: card.keywords,
            isFoil: false,
            isActive: true,
            ownerId: playerId,
            effectText: card.effectText ?? '',
            isHorizontal: false,
            effectTypes: effects.map(eff => eff.type as EffectType)
        };

        for (let i = 0; i < quantity; i++) {
            fullDeck.push({
                instanceId: uuidv4(),
                ...base
            });
        }
    }

    return fullDeck;
}