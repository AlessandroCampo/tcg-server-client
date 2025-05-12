"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = exports.Keyword = exports.Color = exports.SubType = exports.CardType = void 0;
var CardType;
(function (CardType) {
    CardType["MINION"] = "MINION";
    CardType["SPELL"] = "SPELL";
    CardType["TRAP"] = "TRAP";
})(CardType || (exports.CardType = CardType = {}));
var SubType;
(function (SubType) {
    SubType["CONTINOUS"] = "CONTINOUS";
    SubType["EQUIP"] = "EQUIP";
})(SubType || (exports.SubType = SubType = {}));
var Color;
(function (Color) {
    Color["RED"] = "RED";
    Color["BLUE"] = "BLUE";
    Color["BLACK"] = "BLACK";
    Color["GREEN"] = "GREEN";
    Color["YELLOW"] = "YELLOW";
    Color["BROWN"] = "BROWN";
    Color["WHITE"] = "WHITE";
})(Color || (exports.Color = Color = {}));
var Keyword;
(function (Keyword) {
    Keyword["REBORN"] = "reborn";
})(Keyword || (exports.Keyword = Keyword = {}));
var EventType;
(function (EventType) {
    EventType["TURN_ENDED"] = "turn-ended";
    EventType["CARD_DRAWN"] = "card-drawn";
    EventType["CARD_PLAYED"] = "card-played";
    EventType["DIRECT_ATTACK"] = "direct-attack";
    EventType["APPLY_MINION_ATTACK"] = "minion-attack";
    EventType["CHANGE_POSITION"] = "change-position";
    EventType["MANA_BOOST"] = "mana-boost";
    EventType["GAME_OVER"] = "game-over";
})(EventType || (exports.EventType = EventType = {}));
