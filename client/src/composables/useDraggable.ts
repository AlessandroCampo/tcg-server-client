import interact from 'interactjs';
import { useGameController } from '@/stores/gameController';
import { storeToRefs } from 'pinia';
import { useMultiplayer } from './useMultiplayer';


export function setupDraggable(selector: string) {

    const { isMyTurn } = storeToRefs(useGameController());

    interact(selector).draggable({
        listeners: {
            start(event) {

                const target = event.target as HTMLElement;
                console.log('start', target);

                if (!target.dataset.startX || !target.dataset.startY) {
                    target.dataset.startX = '0';
                    target.dataset.startY = '0';
                }

                target.dataset.x = target.dataset.startX;
                target.dataset.y = target.dataset.startY;
            },

            move(event) {
                const { availableTargets } = useMultiplayer();
                if (!isMyTurn.value || availableTargets.value.length) return;
                const target = event.target as HTMLElement;

                const x = (parseFloat(target.dataset.x!) || 0) + event.dx;
                const y = (parseFloat(target.dataset.y!) || 0) + event.dy;

                target.style.transform = `translate(${x}px, ${y}px)`;
                target.dataset.x = x.toString();
                target.dataset.y = y.toString();
            },

            end(event) {
                const target = event.target as HTMLElement;

                if (target.dataset.dropped === 'true') {
                    delete target.dataset.dropped;
                    return;
                }

                target.style.transition = 'transform 0.2s ease';
                target.style.transform = `translate(0px, 0px)`;
                target.dataset.x = '0';
                target.dataset.y = '0';

                setTimeout(() => {
                    target.style.transition = '';
                }, 200);
            }
        }
    });
}
