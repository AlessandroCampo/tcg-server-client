import { sleep } from '@/utils';
import uniqid from 'uniqid';
import { useGameController } from '@/stores/gameController';
import { storeToRefs } from 'pinia';
import type { Color, CardType, SubType, CardParams } from '@shared/interface';



class Card {
    instanceId: string;
    templateId: string;
    name: string;
    image_url: string;
    attack: number;
    private _defense: number;
    cost: number;
    isFoil: boolean;
    isActive: boolean;
    isPlayerControlled: boolean;
    effectName: string;
    effectType: string;
    keywords: string[];
    color: Color;
    type: CardType;
    subtype: SubType;
    effectText: string;

    constructor({
        templateId,
        instanceId,
        name,
        image_url,
        attack,
        defense,  // make sure to pass defense
        cost,
        color,
        type,
        subtype,
        isFoil = false,
        isPlayerControlled = true,
        isActive,
        keywords = [],
        effectText = '',
        effectName = '',
        effectType = 'string'
    }: CardParams) {
        this.templateId = templateId;
        this.instanceId = instanceId;
        this.name = name;
        this.image_url = image_url;
        this.attack = attack;
        this._defense = defense;  // initialize _defense here
        this.cost = cost;
        this.isFoil = isFoil;
        this.effectName = effectName;
        this.effectText = effectText;
        this.isActive = isActive;
        this.isPlayerControlled = isPlayerControlled;
        this.keywords = keywords;
        this.color = color;
        this.type = type;
        this.subtype = subtype;
        this.effectType = effectType;
    }

    get defense(): number {
        return this._defense;
    }

    set defense(value: number) {
        this._defense = value;
        if (value <= 0 && this.isActive) {
            this.destroy();
        }
    }

    async destroy(): Promise<boolean> {
        const { myPlayer, opponentPlayer } = storeToRefs(useGameController());
        await sleep(1);
        const board = this.isPlayerControlled ? myPlayer.value.board : opponentPlayer.value.board;
        const index = board.findIndex(card => card.id === this.id);
        if (index !== -1) {
            board.splice(index, 1);
        }
        return true;
    }

    static cloneFrom(data: Partial<Card> | CardParams, overrides: Partial<CardParams> = {}): Card {
        return new Card({
            templateId: data.templateId,
            instanceId: data.instanceId,
            name: data.name!,
            image_url: data.image_url!,
            attack: data.attack!,
            defense: data.defense!, // must exist or error
            cost: data.cost!,
            color: data.color!,
            type: data.type!,
            subtype: data.subtype!,
            isFoil: data.isFoil ?? false,
            isActive: data.isActive,
            isPlayerControlled: data.isPlayerControlled ?? true,
            keywords: [...(data.keywords ?? [])],
            effectText: data.effectText ?? '',
            effectName: data.effectName ?? '',
            effectType: data.effectType ?? '',
            ...overrides,
        });
    }

}


export { Card };
