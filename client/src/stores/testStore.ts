// store.ts
import { reactive } from 'vue';
import type { Player } from '@/classes/Player';

export const store = reactive({
    opponent: undefined as Player | undefined,
    player: undefined as Player | undefined,

});
