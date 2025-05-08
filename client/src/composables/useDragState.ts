import { ref } from 'vue';
import type { Card } from '@/classes/Card';

const draggingCard = ref<Card | null>(null);

export function useDragState() {
    const setDraggingCard = (card: Card) => {
        draggingCard.value = card;
    };

    const clearDraggingCard = () => {
        draggingCard.value = null;
    };

    const getDraggingCard = () => {
        return draggingCard.value;
    };

    return {
        draggingCard,
        setDraggingCard,
        clearDraggingCard,
        getDraggingCard,
    };
}
