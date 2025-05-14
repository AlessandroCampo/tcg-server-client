import { BasePayload, ValidatorResult, EventType, GameEvent } from "./interfaces";


export const validator = (type: EventType, payload: BasePayload): ValidatorResult => {

    const success: ValidatorResult = {
        success: true
    };

    switch (type) {



        case EventType.DIRECT_ATTACK:
            return success;
        case EventType.CARD_PLAYED:

            return success;

        case EventType.TURN_ENDED:
            //emitEvent('turn-start');
            return success;
        case EventType.CARD_DRAWN:
            // hand.push(event.card)
            return success;
        case EventType.CHANGE_POSITION:
            // hand.push(event.card)
            return success;

        default:
            return success;


        // …etc
    }
}

