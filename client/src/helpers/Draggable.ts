import type { InteractEvent } from '@interactjs/types';

export const handleDragStart = (event: InteractEvent) => {
    const target = event.target as HTMLElement;

    // Save initial position on the element
    if (!target.dataset.startX || !target.dataset.startY) {
        target.dataset.startX = '0';
        target.dataset.startY = '0';
    }

    // Reset position on drag start
    target.dataset.x = target.dataset.startX;
    target.dataset.y = target.dataset.startY;
};
export const handleDragMove = (event: InteractEvent) => {
    const target = event.target as HTMLElement;

    const x = (parseFloat(target.dataset.x!) || 0) + event.dx;
    const y = (parseFloat(target.dataset.y!) || 0) + event.dy;

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.dataset.x = x.toString();
    target.dataset.y = y.toString();
};

export const handleDragEnd = (event: InteractEvent) => {

    const target = event.target as HTMLElement;

    if (target.dataset.dropped === 'true') {
        // Don't reset position, just remove the flag for next drag
        delete target.dataset.dropped;
        return;
    }

    // Otherwise, reset to hand
    target.style.transition = 'transform 0.2s ease';
    target.style.transform = `translate(0px, 0px)`;
    target.dataset.x = '0';
    target.dataset.y = '0';

    setTimeout(() => {
        target.style.transition = '';
    }, 200);
};
export const handleDrop = (event: InteractEvent) => {




};