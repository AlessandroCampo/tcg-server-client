// composables/useCardToBoardAnimation.ts
import { sleep } from '@/utils';
import { Card } from '@shared/Card';
import { nextTick, ref } from 'vue';
import gsap from 'gsap';

const isAnimatin = ref(false);

export function useAnimator() {


    async function animateCardToBoard(card: Card): Promise<void> {
        if (document.getElementById('clone-' + card.instanceId)) return;

        const handEl = document.querySelector(`[data-id="${card.instanceId}"]`) as HTMLElement;
        if (!handEl || isAnimatin.value) return;

        isAnimatin.value = true;

        // ✅ Clone immediately — before Vue removes it
        const handRect = handEl.getBoundingClientRect();
        const clone = handEl.cloneNode(true) as HTMLElement;

        // Clean up class names and transition stuff
        [handEl, clone].forEach(domEl => {
            domEl.className = domEl.className
                .split(' ')
                .filter(c => !c.startsWith('card-slide') && !c.startsWith('v-'))
                .join(' ');
            domEl.removeAttribute('data-v-*');
        });

        handEl.style.opacity = '0'; // Hide the original

        clone.id = 'clone-' + card.instanceId;
        clone.style.position = 'absolute';
        clone.style.left = `${handRect.left}px`;
        clone.style.top = `${handRect.top}px`;
        clone.style.zIndex = '1000';
        clone.style.pointerEvents = 'none';
        clone.style.transition = 'all 400ms ease';
        clone.style.transform = '';

        if (!card.isActive) {
            clone.style.filter = 'grayscale(100%) contrast(75%)';
        }

        // ✅ Wait until the board DOM is updated
        await nextTick();

        const boardEl = document.querySelector(`.my-board-card[data-id="${card.instanceId}"]`) as HTMLElement;
        if (!boardEl) {
            handEl.style.opacity = ''; // Fallback
            clone.remove();
            isAnimatin.value = false;
            return;
        }

        const boardRect = boardEl.getBoundingClientRect();
        boardEl.style.opacity = '0'; // Hide destination card for a moment

        document.body.appendChild(clone);

        // Trigger animation
        requestAnimationFrame(() => {
            clone.style.left = `${boardRect.left}px`;
            clone.style.top = `${boardRect.top}px`;
        });

        return new Promise((resolve) => {
            setTimeout(async () => {
                await sleep(0.1);
                clone.remove();
                boardEl.style.opacity = '';
                isAnimatin.value = false;
                resolve();
            }, 450);
        });
    }

    async function animateAttack(attacker: Card, defender: Card | 'base'): Promise<void> {
        const attackerEl = document.querySelector<HTMLElement>(`[id="${attacker.instanceId}"]`);
        if (!attackerEl) return;

        const targetSelector = defender === 'base'
            ? '.base.enemy'
            : `[id="${(defender as Card).instanceId}"]`;

        const targetEl = document.querySelector<HTMLElement>(targetSelector);
        if (!targetEl) return;

        const attackerRect = attackerEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        // Move from center of attacker to center of target
        const dx = targetRect.left + targetRect.width / 2 - (attackerRect.left + attackerRect.width / 2);
        const dy = targetRect.top + targetRect.height / 2 - (attackerRect.top + attackerRect.height / 2);

        return new Promise<void>((resolve) => {
            gsap.to(attackerEl, {
                x: dx + (defender == 'base' ? 350 : 0),
                y: dy + (defender == 'base' ? -120 : 0),
                duration: 0.3,
                ease: 'power2.out',
                onComplete: () => {
                    gsap.to(attackerEl, {
                        x: 0,
                        y: 0,
                        duration: 0.1,
                        ease: 'power2.in',
                        onComplete: () => {
                            gsap.delayedCall(0.5, resolve); // Half-second pause before resolving
                        },
                    });
                },
            });
        });
    }


    return { animateCardToBoard, animateAttack };
}
