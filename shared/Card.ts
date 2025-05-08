import type { Color, CardType, SubType, CardParams } from './interfaces';



class Card {
    instanceId: string;
    templateId: string;
    name: string;
    image_url: string;
    attack: number | null;
    defense: number | null;
    cost: number;
    isFoil: boolean;
    isActive: boolean;
    isHorizontal: boolean;
    keywords: string[];
    color: Color | "HIDDEN";
    type: CardType | "HIDDEN";
    subtype: SubType | "HIDDEN";
    effectText: string;
    ownerId: string;

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
        effectText = '',

    }: CardParams) {
        this.templateId = templateId;
        this.instanceId = instanceId;
        this.name = name;
        this.image_url = image_url;
        this.attack = attack;
        this.defense = defense;
        this.cost = cost;
        this.isFoil = isFoil;
        this.effectText = effectText;
        this.isActive = isActive;
        this.keywords = keywords;
        this.color = color;
        this.type = type;
        this.subtype = subtype;
        this.ownerId = ownerId;
        this.isHorizontal = isHorizontal;
    }

}


export { Card };
