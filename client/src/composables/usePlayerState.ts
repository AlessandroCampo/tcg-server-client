import { ref } from 'vue';
import { Player } from '@/classes/Player';


export const usePlayerState = (arg: Player) => {

    const player = ref(arg);

    return { player };

}