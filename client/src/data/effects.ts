import { Effect } from "@/classes/Effect";
import { useGameController } from "@/stores/gameController";
import { EffectType } from "@/classes/Effect";
import { storeToRefs } from "pinia";

export interface IDamageable {
    defense: number;
    destroy: () => Promise<boolean>;
}


const dealDamage = (amount: number, target: IDamageable) => {
    target.defense -= amount;
}

//DEAL 1 to a random enemy unit
const fireBallEffect = new Effect({

    type: EffectType.ON_PLAY,
    resolver: () => {
        const store = useGameController();
        const { opponentPlayer } = storeToRefs(store);
        const unitsInPlay = opponentPlayer.value.board.length;

        if (unitsInPlay === 0) return;

        const randomTarget = Math.floor(Math.random() * unitsInPlay);
        const target = opponentPlayer.value.board[randomTarget];
        dealDamage(1, target);
    }
});

const jarOfAvariceEffect = new Effect({

    type: EffectType.ON_PLAY,
    resolver: () => {
        const store = useGameController();
        const { myPlayer } = storeToRefs(store);
        myPlayer.value.draw(1);
        console.log('Drawn 1');
    }
});



export const effects: Record<string, Effect> = {
    'Fire Ball': fireBallEffect,
    'Jar of avaraice': jarOfAvariceEffect
};
