import { CardParams, CardType, Color, Keyword, SubType } from "../../../shared/interfaces";

export type CardTemplateMap = {
    [key: string]: CardParams;
};

export const cardTemplates: CardTemplateMap = {
    BraveMouse: {
        templateId: "1",
        name: "Brave Mouse",
        attack: 2,
        defense: 3,
        cost: 1,
        color: Color.WHITE,
        type: CardType.MINION,
        subtype: null,
        keywords: [],
        effectText: ""
    },
    AngryMonkey: {
        templateId: "2",
        name: "Angry Monkey",
        attack: 3,
        defense: 4,
        cost: 3,
        color: Color.WHITE,
        type: CardType.MINION,
        subtype: null,
        keywords: [Keyword.UNCHAINED],
        effectText: ""
    },
    WanderingRonin: {
        templateId: "3",
        name: "Wandering Ronin",
        attack: 3,
        defense: 3,
        cost: 2,
        color: Color.WHITE,
        type: CardType.MINION,
        subtype: null,
        keywords: [],
        effectText: ""
    },
    DrunkenGoblin: {
        templateId: "4",
        name: "Drunken Goblin",
        attack: 2,
        defense: 1,
        cost: 1,
        color: Color.RED,
        type: CardType.MINION,
        subtype: null,
        keywords: [Keyword.RUSH],
        effectText: "On attack: If this card survives, inflict 1 damage to the enemy base"
    },
    RuinsOrc: {
        templateId: "5",
        name: "Orc of the Ruins",
        attack: 5,
        defense: 7,
        cost: 5,
        color: Color.WHITE,
        type: CardType.MINION,
        subtype: null,
        keywords: [],
        effectText: ""
    },
    StraitJester: {
        templateId: "6",
        name: "Strait Jester",
        attack: 3,
        defense: 1,
        cost: 1,
        color: Color.WHITE,
        type: CardType.MINION,
        subtype: null,
        keywords: [],
        effectText: ""
    },
    GoblinSlave: {
        templateId: "7",
        name: "Goblin Slave",
        attack: 1,
        defense: 1,
        cost: 1,
        color: Color.RED,
        type: CardType.MINION,
        subtype: null,
        keywords: [],
        effectText: "On play: inflict 1 damage to your opponent's base"
    },
    GreedyGoblin: {
        templateId: "8",
        name: "Greedy Goblin",
        attack: 1,
        defense: 2,
        cost: 1,
        color: Color.RED,
        type: CardType.MINION,
        subtype: null,
        keywords: [],
        effectText: "On play: Draw 1 card"
    },
    Fireball: {
        templateId: "9",
        name: "Fireball",
        attack: null,
        defense: null,
        cost: 3,
        color: Color.RED,
        type: CardType.SPELL,
        subtype: null,
        keywords: [],
        effectText: "Inflict 2 damage to the enemy base"
    },
    CleverSpider: {
        templateId: "10",
        name: "Clever Spider",
        attack: 3,
        defense: 4,
        cost: 3,
        color: Color.WHITE,
        type: CardType.MINION,
        subtype: null,
        keywords: [],
        effectText: ""
    },
    GoblinScout: {
        templateId: "11",
        name: "Goblin Scout",
        attack: 1,
        defense: 3,
        cost: 1,
        color: Color.RED,
        type: CardType.MINION,
        subtype: null,
        keywords: [],
        effectText: "On Play: If you control another Goblin, gains +1/+1"
    },
    LineageHeir: {
        templateId: "12",
        name: "Lineage Heir",
        attack: 4,
        defense: 5,
        cost: 4,
        color: Color.WHITE,
        type: CardType.MINION,
        subtype: null,
        keywords: [],
        effectText: ""
    },
    SealMonk: {
        templateId: "13",
        name: "Seal Monk",
        attack: 2,
        defense: 4,
        cost: 4,
        color: Color.WHITE,
        type: CardType.MINION,
        subtype: null,
        keywords: [],
        effectText: "On play: silence 1 target enemy unit"
    },
    ForgeInitiate: {
        templateId: "14",
        name: "Forge Initiate",
        attack: 1,
        defense: 1,
        cost: 2,
        color: Color.RED,
        type: CardType.MINION,
        subtype: null,
        keywords: [],
        effectText: "Tap: give +2/+1 to target unit"
    }
};
