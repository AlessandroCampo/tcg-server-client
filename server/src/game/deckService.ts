import { prisma } from '../prismaClient';
import { CardParams } from '../../../shared/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { testDecks } from '../testDecks';
import { Keyword } from 'src/generated/prisma';
import { Card as dbCard } from 'src/generated/prisma';
import { Card } from '@shared/Card';


export async function fetchDeckData(
    deckList: { name: string; quantity: number }[],
    playerId: string
): Promise<Card[]> {
    const cardNames = Array.from(
        new Set(deckList.map((t: { name: string }) => t.name))
    );

    const templates = await prisma.card.findMany({
        where: { name: { in: cardNames } },
        include: { cardKeywords: { include: { keyword: true } } }
    });

    const fullDeck: Card[] = [];

    for (const { name, quantity } of deckList) {
        const dbCard = templates.find((c: dbCard) => c.name === name);
        if (!dbCard) continue;

        const base: Omit<Card, 'instanceId'> = {
            templateId: dbCard.id,
            name: dbCard.name,
            image_url: `${process.env.BASE_URL}/uploads/${dbCard.id}.jpg`,
            attack: dbCard.attack,
            originalAttack: dbCard.attack,

            defense: dbCard.defense,
            originalDefense: dbCard.defense,
            cost: dbCard.cost,
            originalCost: dbCard.cost,
            color: dbCard.color as any,
            type: dbCard.type as any,
            subtype: dbCard.subtype as any,
            keywords: dbCard.cardKeywords.map(k => k.keyword.name),
            isFoil: false,
            isActive: true,
            ownerId: playerId,
            effectText: dbCard.effectText ?? '',
            isHorizontal: false
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