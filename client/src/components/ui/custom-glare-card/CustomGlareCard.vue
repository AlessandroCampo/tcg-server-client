<template>
  <div ref="refElement"
    class="container-style relative isolate transition-transform will-change-transform overflow-hidden" :class="[
      'w-[185px] h-[290px]',
      'rounded-lg border border-slate-700 bg-slate-900',
    ]" @pointermove="glare && handlePointerMove" @pointerenter="glare && handlePointerEnter"
    @pointerleave="glare && handlePointerLeave">

    <template v-if="!isEnemy">
      <div class="relative h-full w-full overflow-hidden rounded-t-lg">
        <img :src="card.image_url" alt="card artwork" class="object-cover w-full h-full" />
      </div>

      {{ isEnemy }}

      <!-- Card Name -->
      <div
        class="absolute top-2 left-1/2 -translate-x-1/2 text-lg px-3 font-bold text-white drop-shadow-md bg-slate-800 rounded-md">
        {{ card.name }} {{ isEnemy ? "E" : "NE" }} pippo
      </div>

      <!-- Mana Cost -->
      <div class="absolute top-2 left-2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded-md">
        {{ card.cost }}
      </div>

      <!-- Attack -->
      <div class="absolute bottom-4 right-4 bg-slate-800 text-white text-sm font-bold px-2 py-1 rounded-md">
        ⚔️ {{ card.attack }}
      </div>

      <!-- Defense -->
      <div class="absolute bottom-4 left-4 bg-slate-800 text-white text-sm font-bold px-2 py-1 rounded-md">
        🛡️ {{ card.defense }}
      </div>
    </template>


    <!-- Rarity Foil / Glare layers -->
    <template v-if="glare && !isEnemy">
      <div class="glare-effect"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTimeoutFn } from '@vueuse/core';
import type { CardType } from '@/interfaces';

interface GlareCardProps {
  card: CardType;
  glare?: boolean;
  isEnemy: boolean;
}

const props = defineProps<GlareCardProps>();

const glare = props.glare ?? true;
const card = props.card;

const refElement = ref<HTMLElement | null>(null);
const isPointerInside = ref(false);

const state = ref({
  glare: { x: 50, y: 50 },
  background: { x: 50, y: 50 },
  rotate: { x: 0, y: 0 },
});

function handlePointerMove(event: PointerEvent) {

  if (props.isEnemy) return;
  const rotateFactor = 0.4;
  const rect = refElement.value?.getBoundingClientRect();
  if (rect) {
    const position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    const percentage = {
      x: (100 / rect.width) * position.x,
      y: (100 / rect.height) * position.y,
    };
    const delta = {
      x: percentage.x - 50,
      y: percentage.y - 50,
    };
    state.value.background.x = 50 + percentage.x / 4 - 12.5;
    state.value.background.y = 50 + percentage.y / 3 - 16.67;
    state.value.rotate.x = -(delta.x / 3.5) * rotateFactor;
    state.value.rotate.y = (delta.y / 2) * rotateFactor;
    state.value.glare.x = percentage.x;
    state.value.glare.y = percentage.y;
  }
}

function handlePointerEnter() {
  if (props.isEnemy) return;
  isPointerInside.value = true;
  useTimeoutFn(() => {
    if (isPointerInside.value && refElement.value) {
      refElement.value.style.setProperty('--duration', '0s');
    }
  }, 300);
}

function handlePointerLeave() {
  if (props.isEnemy) return;
  isPointerInside.value = false;
  if (refElement.value) {
    refElement.value.style.removeProperty('--duration');
    state.value.rotate = { x: 0, y: 0 };
  }
}
</script>

<style scoped>
.container-style {
  --m-x: v-bind(state.glare.x + "%");
  --m-y: v-bind(state.glare.y + "%");
  --r-x: v-bind(state.rotate.x + "deg");
  --r-y: v-bind(state.rotate.y + "deg");
  --bg-x: v-bind(state.background.x + "%");
  --bg-y: v-bind(state.background.y + "%");
  --duration: 300ms;
  --foil-size: 100%;
  --opacity: 0.6;
  --radius: 20px;
  --easing: ease;
  --transition: var(--duration) var(--easing);
  transform: rotateY(var(--r-x)) rotateX(var(--r-y));
  perspective: 600px;
  transition: transform var(--duration) var(--easing);
}

.background-style {
  --step: 5%;
  --foil-svg: url("data:image/svg+xml,%3Csvg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.99994 3.419C2.99994 3.419 21.6142 7.43646 22.7921 12.153C23.97 16.8695 3.41838 23.0306 3.41838 23.0306' stroke='white' stroke-width='5' stroke-miterlimit='3.86874' stroke-linecap='round' style='mix-blend-mode:darken'/%3E%3C/svg%3E");
  --pattern: var(--foil-svg) center/100% no-repeat;
  --rainbow: repeating-linear-gradient(0deg,
      rgb(255, 119, 115) calc(var(--step) * 1),
      rgba(255, 237, 95, 1) calc(var(--step) * 2),
      rgba(168, 255, 95, 1) calc(var(--step) * 3),
      rgba(131, 255, 247, 1) calc(var(--step) * 4),
      rgba(120, 148, 255, 1) calc(var(--step) * 5),
      rgb(216, 117, 255) calc(var(--step) * 6),
      rgb(255, 119, 115) calc(var(--step) * 7)) 0% var(--bg-y) / 200% 700% no-repeat;
  --diagonal: repeating-linear-gradient(128deg,
      #0e152e 0%,
      hsl(180, 10%, 60%) 3.8%,
      hsl(180, 10%, 60%) 4.5%,
      hsl(180, 10%, 60%) 5.2%,
      #0e152e 10%,
      #0e152e 12%) var(--bg-x) var(--bg-y) / 300% no-repeat;
  --shade: radial-gradient(farthest-corner circle at var(--m-x) var(--m-y),
      rgba(255, 255, 255, 0.1) 12%,
      rgba(255, 255, 255, 0.15) 20%,
      rgba(255, 255, 255, 0.25) 120%) var(--bg-x) var(--bg-y) / 300% no-repeat;

  position: absolute;
  inset: 0;
  background: var(--pattern), var(--rainbow), var(--diagonal), var(--shade);
  background-blend-mode: hue, hue, hue, overlay;
  pointer-events: none;
  clip-path: inset(0 0 0 0 round 12px);
}

.glare-effect {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(farthest-corner circle at var(--m-x) var(--m-y),
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0.15) 30%,
      transparent 80%);
  mix-blend-mode: soft-light;
  /* <- Key change */
  opacity: 0.6;
  /* <- Lower opacity */
}
</style>
