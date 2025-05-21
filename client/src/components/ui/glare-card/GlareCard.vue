<template>
  <div ref="refElement"
    class="container-style duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] container relative isolate h-full w-full transition-transform will-change-transform [aspect-ratio:2/3] [contain:layout_style] [perspective:600px] card-root card"
    @pointermove="handlePointerMove" :class="[
      card.isActive ? 'active' : 'inactive',
      card.isHorizontal ? 'horizontal' : 'vertical'
    ]" @pointerenter="handlePointerEnter" @pointerleave="handlePointerLeave">

    <div
      class="duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] grid h-full w-full origin-center overflow-hidden rounded-lg  border-slate-800 transition-transform will-change-transform [transform:rotateY(var(--r-x))_rotateX(var(--r-y))] hover:filter-none hover:[--duration:200ms] hover:[--easing:linear] hover:[--opacity:0.6]">
      <div class="grid  size-full mix-blend-soft-light [clip-path:inset(0_0_0_0_round_var(--radius))] [grid-area:1/1]">

        <div :class="cn('size-full bg-slate-950', props.class)">
          <template v-if="!showBack">


            <img :src="cardTemplate" alt="card artwork" class="object-cover w-full block h-full card-template" />


            <!-- 
                 <img :src="props.card.image_url" alt="card artwork" class="object-cover w-full block h-full" />
            -->

            <img :src="'/artworks/' + card.templateId + '.jpg'" alt="card artwork"
              class="object-cover w-full block h-full" />


            <div class="card-name">
              <h2 v-show="!card.statusConditions.includes(StatusCondition.CHAINED)">
                {{ card.name }}
              </h2>



            </div>


            <!-- Mana Cost -->
            <div class="stat cost">
              {{ card.cost }}
            </div>

            <!-- Attack -->
            <div class="stat atk">
              {{ card.attack }}
            </div>

            <!-- Defense -->
            <div class="stat def">
              {{ card.defense }}
            </div>




            <div class="text text-black">
              <div class="mb-2  mx-auto px-2 keyword-container">
                {{ card.keywords.join(',') }}
              </div>
              <div>
                <span v-show="isBt && card.btText" class="text-red-900 text-center">
                  {{ card.btText }}
                </span>
                {{ card.effectText }}
              </div>

            </div>

          </template>

          <template v-else>
            <img :src="cardback" alt="card artwork" class="object-cover w-full block h-full" />
          </template>



        </div>
      </div>
      <template v-if="card.isFoil && !isEnemy">
        <div
          class="transition-background duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] will-change-background grid size-full opacity-[var(--opacity)] mix-blend-soft-light transition-opacity [background:radial-gradient(farthest-corner_circle_at_var(--m-x)_var(--m-y),_rgba(255,255,255,0.8)_10%,_rgba(255,255,255,0.65)_20%,_rgba(255,255,255,0)_90%)] [clip-path:inset(0_0_0px_0_round_var(--radius))] [grid-area:1/1]" />
        <div
          class="background-style will-change-background after:grid-area-[inherit] after:bg-repeat-[inherit] after:bg-attachment-[inherit] after:bg-origin-[inherit] after:bg-clip-[inherit] relative grid size-full opacity-[var(--opacity)] mix-blend-color-dodge transition-opacity [background-blend-mode:hue_hue_hue_overlay] [background:var(--pattern),_var(--rainbow),_var(--diagonal),_var(--shade)] [clip-path:inset(0_0_0px_0_round_var(--radius))] [grid-area:1/1] after:bg-[inherit] after:mix-blend-exclusion after:content-[\'\'] after:[background-blend-mode:soft-light,_hue,_hard-light] after:[background-position:center,_0%_var(--bg-y),_calc(var(--bg-x)*_-1)_calc(var(--bg-y)*_-1),_var(--bg-x)_var(--bg-y)] after:[background-size:var(--foil-size),_200%_400%,_800%,_200%]" />
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils';
import { useTimeoutFn } from '@vueuse/core';
import { computed, ref } from 'vue';
import { Card, StatusCondition } from '@shared/Card';
import cardback from '@/assets/images/cards/card-back.png';
import minionTemplate from '@/assets/images/cards/card-template.png';
import spellTemplate from '@/assets/images/cards/spell-template.png';
import { Player } from '@/classes/Player';



const URL = "http://localhost:3000";

interface GlareCardProps {
  class?: string;
  card: Card,
  showBack: boolean,
  isEnemy: boolean,
  isBt?: boolean
}

const props = defineProps<GlareCardProps>();

const cardTemplate = props.card.type == 'MINION' ? minionTemplate : spellTemplate;

const isPointerInside = ref(false);
const refElement = ref<HTMLElement | null>(null);

const state = ref({
  glare: { x: 50, y: 50 },
  background: { x: 50, y: 50 },
  rotate: { x: 0, y: 0 },
});

const getCostClass = computed(() => {
  return {
    'text-green-200': props.card.cost > props.card.originalCost,
    'text-red-200': props.card.cost < props.card.originalCost,
    'text-white': props.card.cost === props.card.originalCost
  };
})
const getAttackClass = computed(() => {
  if (!props.card.attack || !props.card.originalAttack) return '';
  return {
    'text-green-400': props.card.attack > props.card.originalAttack,
    'text-red-400': props.card.attack < props.card.originalAttack,
    'text-white': props.card.attack === props.card.originalAttack
  };
})
const getDefenseClass = computed(() => {
  if (!props.card.defense || !props.card.originalDefense) return '';
  return {
    'text-green-400': props.card.defense > props.card.originalDefense,
    'text-red-400': props.card.defense < props.card.originalDefense,
    'text-white': props.card.defense === props.card.originalDefense
  };
})

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
.background-style {
  z-index: 1;
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
  background-blend-mode: hue, hue, hue, overlay;
}

.container-style {
  --m-x: v-bind(state.glare.x + "%");
  --m-y: v-bind(state.glare.y + "%");
  --r-x: v-bind(state.rotate.x + "deg");
  --r-y: v-bind(state.rotate.y + "deg");
  --bg-x: v-bind(state.background.x + "%");
  --bg-y: v-bind(state.background.y + "%");
  --duration: 300ms;
  --foil-size: 100%;
  --opacity: 0;
  --radius: 1px;
  --easing: ease;
  --transition: var(--duration) var(--easing);
}

.card-template {
  position: absolute;
  z-index: 1;
  object-fit: cover !important;
}


.stat,
.card-name,
.text {
  position: absolute;
  z-index: 100;
  font-weight: bold;


}

.stat {
  color: white;
}

.card-name {
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  width: 75px;
  overflow-x: hidden;
  white-space: nowrap;
  text-align: center;
  font-size: .5rem;
}

.overlay {

  text-align: center;

  /* semi-transparent white */
  padding: 2px 6px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  gap: .6rem;
}

.text {
  position: absolute;
  bottom: 20px;
  width: 80%;
  left: 50%;
  transform: translateX(-50%);
  font-size: .6rem !important;
  text-align: center;
  display: flex;
  flex-direction: column;
  padding-block: .5rem;
  border-radius: .5rem;
}

.keywords {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  padding-bottom: .3rem;

}

.keyword {
  width: 25px;

}

.keyword-container {
  background-color: rgba(255, 255, 255, 0.7);
}





.cost {
  top: 5px;
  left: 12px;
}

.atk {
  bottom: 7px;
  left: 12px;
}

.def {
  bottom: 7px;
  right: 12px;
}

.card-root {
  height: 100%;
  width: 100%;
}
</style>
