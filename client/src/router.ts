import { createWebHistory, createRouter } from 'vue-router';
import CreateCard from './pages/CreateCard.vue';
import MatchMaker from './pages/MatchMaker.vue';
import EndGame from './pages/EndGame.vue';
import GameContainer from './GameContainer.vue';

const routes = [
    { path: '/game', component: GameContainer, name: 'game' },
    { path: '/', component: MatchMaker },
    { path: '/game-over/:outcome', component: EndGame, name: 'game-over', props: true },
    { path: '/create-card', component: CreateCard },
];

export const myRouter = createRouter({
    history: createWebHistory(),
    routes,
});
