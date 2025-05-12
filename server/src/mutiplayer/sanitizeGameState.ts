import { GameState, PlayerState } from "@shared/interfaces";
import { Card } from "@shared/Card";

export function sanitizeGameStateFor(
    viewerId: string,
    state: GameState
): GameState {
    // deep clone so we don’t mutate the real state
    const clone: GameState = JSON.parse(JSON.stringify(state));

    for (const [pid, pstate] of Object.entries(clone.players) as [
        string,
        PlayerState
    ][]) {
        if (pid !== viewerId) {
            // only hide the opponent’s hand
            pstate.hand = pstate.hand.map((card: Card) => ({
                // keep IDs so you can still reference card–e.g. for debugger
                templateId: card.templateId,
                instanceId: card.instanceId,
                ownerId: pid,
                isActive: true,

                // everything else hidden or zeroed
                name: 'HIDDEN',
                image_url: '',
                attack: 0,
                defense: 0,
                cost: 0,
                originalAttack: 0,
                originalCost: 0,
                originalDefense: 0,

                // you could also use a special “hidden” enum value
                color: 'HIDDEN' as any,
                type: 'HIDDEN' as any,
                subtype: 'HIDDEN' as any,

                // preserve optional flags (or force to false)
                isFoil: false,
                isPlayerControlled: false,
                isHorizontal: false,

                // strip out keywords/effects
                keywords: [],
                effectText: '',
                effectName: '',
                effectType: '',
            }));
        }
    }

    return clone;
}