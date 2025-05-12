"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const interfaces_1 = require("./interfaces");
const validator = (type, payload) => {
    const success = {
        success: true
    };
    switch (type) {
        case interfaces_1.EventType.DIRECT_ATTACK:
            return success;
        case interfaces_1.EventType.CARD_PLAYED:
            return success;
        case interfaces_1.EventType.TURN_ENDED:
            //emitEvent('turn-start');
            return success;
        case interfaces_1.EventType.CARD_DRAWN:
            // hand.push(event.card)
            return success;
        case interfaces_1.EventType.CHANGE_POSITION:
            // hand.push(event.card)
            return success;
        default:
            return success;
        // …etc
    }
};
exports.validator = validator;
