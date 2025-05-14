import { EffectType } from './Effect';
import type { Color, CardType, SubType, CardParams, Keyword } from './interfaces';



class Card {
    instanceId: string;
    templateId: string;
    name: string;
    image_url: string;
    attack: number | null;
    defense: number | null;
    originalAttack: number | null;
    originalDefense: number | null;
    cost: number;
    originalCost: number;
    isFoil: boolean;
    isActive: boolean;
    isHorizontal: boolean;
    keywords: Keyword[];
    color: Color | "HIDDEN";
    type: CardType | "HIDDEN";
    subtype: SubType | "HIDDEN" | null;
    effectText: string;
    ownerId: string;
    effectTypes: EffectType[]

    constructor({
        templateId,
        instanceId,
        name,
        image_url,
        attack,
        defense,
        cost,
        color,
        type,
        subtype,
        isFoil = false,
        isHorizontal = false,
        isActive = true,
        ownerId,
        keywords = [],
        effectTypes = [],
        effectText = '',

    }) {
        this.templateId = templateId;
        this.instanceId = instanceId;
        this.name = name;
        this.image_url = image_url;
        this.attack = attack;
        this.defense = defense;
        this.originalAttack = attack;
        this.originalDefense = defense;
        this.cost = cost;
        this.originalCost = cost;
        this.isFoil = isFoil;
        this.effectText = effectText;
        this.isActive = isActive;
        this.keywords = keywords;
        this.color = color;
        this.type = type;
        this.subtype = subtype;
        this.ownerId = ownerId;
        this.isHorizontal = isHorizontal;
        this.effectTypes = effectTypes;
    }

}


export { Card };
