"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
class Card {
    constructor({ templateId, instanceId, name, image_url, attack, defense, cost, color, type, subtype, isFoil = false, isHorizontal = false, isActive = true, ownerId, keywords = [], effectText = '', }) {
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
    }
}
exports.Card = Card;
