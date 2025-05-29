import { ArcheType } from "../../../shared/Card";
import { CardParams, CardType, Color, Keyword, SubType } from "../../../shared/interfaces";
import { CardTemplateMap } from "../../../shared/interfaces";



export const blackTemplates: CardTemplateMap = {
    RottingGhoul: {
        templateId: "31",
        name: "Rotting Ghoul",
        attack: 1,
        defense: 1,
        cost: 1,
        color: Color.BLACK,
        type: CardType.MINION,
        archetype: ArcheType.UNDEAD,
        subtype: null,
        keywords: [],
        effectText: "On attack: gains +1/+1",
        btText: "On death: inflict 1 damage to every enemy unit",
    },
    BonecladSkeleton: {
        templateId: "32",
        name: "Boneclad Skeleton",
        attack: 1,
        defense: 2,
        cost: 1,
        color: Color.BLACK,
        type: CardType.MINION,
        archetype: ArcheType.UNDEAD,
        subtype: null,
        keywords: [Keyword.BONESKIN],
        effectText: "",
    },
    ScavengerRat: {
        templateId: "33",
        name: "Scavenger Rat",
        attack: 1,
        defense: 1,
        cost: 1,
        color: Color.BLACK,
        type: CardType.MINION,
        archetype: ArcheType.UNDEAD,
        subtype: null,
        keywords: [Keyword.BONESKIN],
        effectText: "On attack: kill the defending minion",
    },
    RottingGrizzly: {
        templateId: "34",
        name: "Rotting Grizzly",
        attack: 2,
        defense: 5,
        cost: 2,
        color: Color.BLACK,
        type: CardType.MINION,
        archetype: ArcheType.UNDEAD,
        subtype: null,
        keywords: [],
        effectText: "On pass: this unit loses 1 health",
        btText: "On death: your base gains 1 health"
    },
    DeliriousMummy: {
        templateId: "35",
        name: "Delirious Mummy",
        attack: 2,
        defense: 3,
        cost: 2,
        color: Color.BLACK,
        type: CardType.MINION,
        archetype: ArcheType.UNDEAD,
        subtype: null,
        keywords: [Keyword.BONESKIN],
        effectText: "",
        btText: "On attack: gains +1\+2"
    },
    Plaguebearer: {
        templateId: "36",
        name: "Plaguebearer",
        attack: 2,
        defense: 2,
        cost: 2,
        color: Color.BLACK,
        type: CardType.MINION,
        subtype: null,
        keywords: [],
        effectText: "On play: inflict 1 damage to target enemy unit",
        btText: "On death: chain a create with cost 3 or less"
    },
    LibraryVampire: {
        templateId: "37",
        name: "Library Vampire",
        attack: 2,
        defense: 1,
        cost: 2,
        color: Color.BLACK,
        type: CardType.MINION,
        archetype: ArcheType.UNDEAD,
        subtype: null,
        keywords: [],
        effectText: "On play: draw 1 card",
        btText: "On death: reborn 1 random UNDEAD wiht cost 2 or less"
    },
    CryptAssassin: {
        templateId: "38",
        name: "Crypt Assassin",
        attack: 2,
        defense: 1,
        cost: 3,
        color: Color.BLACK,
        type: CardType.MINION,
        subtype: null,
        keywords: [],
        effectText: "On play: destroy target enemy unit with 2 or less health",
    },
    SlowdeathSeer: {
        templateId: "39",
        name: "Slowdeath Seer",
        attack: 2,
        defense: 3,
        cost: 3,
        color: Color.BLACK,
        type: CardType.MINION,
        subtype: null,
        keywords: [],
        effectText: "Whenever one of your units dies, heal 1 health",
    },
    CultServant: {
        templateId: "40",
        name: "Cult Servant",
        attack: 4,
        defense: 4,
        cost: 3,
        color: Color.BLACK,
        type: CardType.MINION,
        subtype: null,
        keywords: [Keyword.HONORLESS],
        effectText: "On play: lose 1 health",
        btText: "On death: your base gains 1 health"
    },

    ThirstySuccubus: {
        templateId: "41",
        name: "Thirsty Succubus",
        attack: 3,
        defense: 3,
        cost: 3,
        color: Color.BLACK,
        type: CardType.MINION,
        subtype: null,
        keywords: [Keyword.RUSH, Keyword.LIFESTEAL],
        effectText: '',
        btText: "On attack: gain +2/+1",
        archetype: ArcheType.UNDEAD
    },

    Mandragora: {
        templateId: "42",
        name: "Mandragora",
        attack: 3,
        defense: 2,
        cost: 3,
        color: Color.BLACK,
        type: CardType.MINION,
        subtype: null,
        keywords: [Keyword.MARTYR],
        effectText: "On play: chain 1 target enemy unit",
        btText: "On death: deal 3 damage to a random enemy unit",

    },
    CursedSpirit: {
        templateId: "43",
        name: "Cursed Spirit",
        attack: 3,
        defense: 5,
        cost: 4,
        color: Color.BLACK,
        type: CardType.MINION,
        subtype: null,
        keywords: [Keyword.HONORLESS],
        effectText: "On Kill: kill the unit with the lowest health your opponent controls.",
        btText: "On death: Chain the enemy unit with highest cost.",
        archetype: ArcheType.UNDEAD
    },

    InfectedGhoul: {
        templateId: "44",
        name: "Infected Ghoul",
        attack: 3,
        defense: 4,
        cost: 4,
        color: Color.BLACK,
        type: CardType.MINION,
        subtype: null,
        keywords: [],
        effectText: "On death: deal 2 damage to all units on the battlefield.",
        btText: "On death, deal 1 damage to the enemy base.",
        archetype: ArcheType.UNDEAD
    },

    JudgeOfDamnedSouls: {
        templateId: "45",
        name: "Judge of Damned Souls",
        attack: 4,
        defense: 3,
        cost: 4,
        color: Color.BLACK,
        type: CardType.MINION,
        subtype: null,
        keywords: [],
        effectText: "On play: destroy an enemy creature with 3 or less attack.",
        btText: "On attack: gains +2/+2."
    },

    ExtinctionNecromancer: {
        templateId: "46",
        name: "Extinction Necromancer",
        attack: 3,
        defense: 3,
        cost: 4,
        color: Color.BLACK,
        type: CardType.MINION,
        subtype: null,
        keywords: [],
        effectText: "On play: reborn a randon unit with Boneskin from your graveyard that costs 3 or less.",
        btText: ""
    },

    BoneAbomination: {
        templateId: "47",
        name: "Bone Abomination",
        attack: 4,
        defense: 4,
        cost: 4,
        color: Color.BLACK,
        type: CardType.MINION,
        subtype: null,
        keywords: [Keyword.BONESKIN],
        effectText: "",
        btText: "",
        archetype: ArcheType.UNDEAD
    },

    MasterOfDarkThorns: {
        templateId: "48",
        name: "Master of Dark Thorns",
        attack: 3,
        defense: 4,
        cost: 4,
        color: Color.BLACK,
        type: CardType.MINION,
        subtype: null,
        keywords: [Keyword.FEARLESS],
        effectText: "After combat: deal 1 damage to the enemy base.",
        btText: "On battle death: destroy the creature it fought."
    },
    HighRankAssassin: {
        templateId: "49",
        name: "High-Rank Assassin",
        attack: 4,
        defense: 3,
        cost: 5,
        color: Color.BLACK,
        type: CardType.MINION,
        subtype: null,
        keywords: [],
        effectText: "On play: kill a tapped enemy creature.",
        btText: ""
    },

    HeraldOfTorment: {
        templateId: "50",
        name: "Herald of Torment",
        attack: 3,
        defense: 6,
        cost: 5,
        color: Color.BLACK,
        type: CardType.MINION,
        subtype: null,
        keywords: [Keyword.IMMOBILE, Keyword.HEROIC_SPIRIT],
        effectText: "",
        btText: "On defend: gains +0/+2"
    },

    AbyssContaminator: {
        templateId: "51",
        name: "Abyss Contaminator",
        attack: 4,
        defense: 4,
        cost: 5,
        color: Color.BLACK,
        type: CardType.MINION,
        subtype: null,
        keywords: [],
        effectText: "On play: reduce the attack of target enemy unit by 3.",
        btText: "",
        archetype: ArcheType.UNDEAD
    },

    SkeletonDragon: {
        templateId: "52",
        name: "Skeleton Dragon",
        attack: 4,
        defense: 7,
        cost: 6,
        color: Color.BLACK,
        type: CardType.MINION,
        subtype: null,
        keywords: [Keyword.BONESKIN],
        effectText: "On play: kill target enemy unit with 3 or less health.",
        btText: "",
        archetype: ArcheType.UNDEAD
    },

    BloodyNecromancer: {
        templateId: "53",
        name: "Bloody Necromancer",
        attack: 6,
        defense: 5,
        cost: 7,
        color: Color.BLACK,
        type: CardType.MINION,
        subtype: null,
        keywords: [Keyword.LIFESTEAL],
        effectText: "On play: deal 2 damage to every enemy unit. Gain 1 health for each one killed.",
        btText: "On kill: gains +2/+2."
    },

    DarkPactWitch: {
        templateId: "54",
        name: "Witch of the Dark Pact",
        attack: 4,
        defense: 7,
        cost: 8,
        color: Color.BLACK,
        type: CardType.MINION,
        subtype: null,
        keywords: [],
        effectText: "On play: destroy all your other units. For each one, destroy a random enemy unit.",
        btText: ""
    },

    TheSoulReaper: {
        templateId: "55",
        name: "The Soul Reaper",
        attack: 7,
        defense: 7,
        cost: 9,
        color: Color.BLACK,
        type: CardType.MINION,
        subtype: null,
        keywords: [Keyword.FEARLESS],
        effectText: "On summon: destroy an enemy creature.",
        btText: "On pass: your base gains 1 health."
    },
    ElixirOfLongLife: {
        templateId: "56",
        name: "Elixir of Long Life",
        cost: 2,
        attack: null,
        defense: null,
        subtype: null,
        color: Color.BLACK,
        type: CardType.SPELL,
        keywords: [],
        effectText: "Draw 2 cards.",
        btText: ""
    },

    /*  
        CursedMausoleum: {
        templateId: "57",
        name: "Cursed Mausoleum",
        cost: 3,
        color: Color.BLACK,
        type: CardType.SPELL,
        attack: null,
        defense: null,
        subtype: SubType.FIELD,
        keywords: [],
        effectText: "Pay 1 mana and discard a random card: summon a random creature from your graveyard that costs 3 or less.",
    },

    */


    TouchOfDeath: {
        templateId: "58",
        name: "Touch of Death",
        cost: 1,
        color: Color.BLACK,
        type: CardType.SPELL,
        attack: null,
        defense: null,
        subtype: null,
        keywords: [],
        effectText: "Deal 2 damage to a creature.",
        btText: ""
    }


};
