<template>
    <div>
        <div class="deck-proxy" :class="isEnemy ? 'player' : 'opponent'">
            <figure class="deck-container">
                <img v-for="(card, index) in cardsAmount" :key="index" class="card" :src="CardBack"
                    :style="{ zIndex: cardsAmount - index, marginTop: `${index * 8.2}px`, transform: `translateY(-${index * 10}px)` }" />

                <img class="card" :src="CardBack" />

                <div class="deck-counter">
                    {{ cardsAmount }}
                </div>
            </figure>
        </div>
    </div>


</template>

<script setup lang="ts">

import CardBack from '@/assets/images/cards/card-back.png';


const { isEnemy, cardsAmount } = defineProps<{
    isEnemy: boolean;
    cardsAmount: number;
}>();

</script>


<style scoped>
.deck-counter {
    z-index: 300000;
    color: white;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid black;
    background-color: rgba($color: #000000, $alpha: 0.8);
    position: absolute;
    left: 50%;
    top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 35px;
    font-weight: bold;
    transform: translate(-50%, -50%);
}



.deck-container {
    position: relative;
    height: 240px;
    width: 170px;

}

.deck-proxy {
    height: 240px;
    width: 170px;
    position: relative;
}


.card {
    position: absolute;
    left: 0;
    height: 240px;
    width: 170px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
    transition: all 0.3s ease-in-out;
    background-size: cover;
}
</style>
