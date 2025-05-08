<template>
    <div class="drag-handle" draggable="true" @dragstart="startDrag" @dragend="endDrag">

    </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { useDragState } from '@/composables/useDragState';
import GlareCard from '../ui/glare-card/GlareCard.vue';
import type { Card } from '@/classes/Card';

interface CardWrapperProps {
    card: Card,
    isEnemy: boolean
}

const { card, isEnemy } = defineProps<CardWrapperProps>();

const { setDraggingCard, clearDraggingCard } = useDragState();

const startDrag = (e: DragEvent) => {
    const target = e.target as HTMLElement;
    if (target) {
        // Store the initial position
        const rect = target.getBoundingClientRect();
        target.style.position = 'absolute';
        target.style.left = `${rect.left}px`;
        target.style.top = `${rect.top}px`;
        target.style.transition = 'none'; // Disable transition during drag
    }

    setDraggingCard(card);
};


const endDrag = (e: DragEvent) => {
    clearDraggingCard();
};
</script>

<style scoped>
.drag-handle {
    cursor: grab;
}
</style>