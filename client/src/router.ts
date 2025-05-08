import { createWebHistory, createRouter } from 'vue-router';
import CreateCard from './pages/CreateCard.vue';
import GameContainer from './GameContainer.vue';

const routes = [
    { path: '/', component: GameContainer },
    { path: '/create-card', component: CreateCard },
];

export const myRouter = createRouter({
    history: createWebHistory(),
    routes,
});
