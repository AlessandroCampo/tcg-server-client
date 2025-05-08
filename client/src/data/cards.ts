import { Card } from '@/classes/Card';
import drakeImage from '@/assets/images/cards/drake.png'; // Just reusing the image for now

export const minions: Card[] = [
    new Card({ cost: 1, attack: 1, defense: 2, name: "Young Scout", image_url: drakeImage, isFoil: false, effect: { function: () => { }, description: "" } }),
    new Card({ cost: 1, attack: 2, defense: 1, name: "Swift Rat", image_url: drakeImage, isFoil: false, effect: { function: () => { }, description: "" } }),
    new Card({ cost: 2, attack: 2, defense: 2, name: "Drake", image_url: drakeImage, isFoil: false, effect: { function: () => { }, description: "" } }),
    new Card({ cost: 2, attack: 3, defense: 1, name: "Feral Wolf", image_url: drakeImage, isFoil: false, effect: { function: () => { }, description: "" } }),
    new Card({ cost: 3, attack: 3, defense: 3, name: "Battle Rhino", image_url: drakeImage, isFoil: false, effect: { function: () => { }, description: "" } }),
    new Card({ cost: 3, attack: 4, defense: 2, name: "Sky Hunter", image_url: drakeImage, isFoil: true, effect: { function: () => { }, description: "" } }),
    new Card({ cost: 4, attack: 5, defense: 3, name: "Iron Golem", image_url: drakeImage, isFoil: true, effect: { function: () => { }, description: "" } }),
    new Card({ cost: 4, attack: 4, defense: 4, name: "Stone Guardian", image_url: drakeImage, isFoil: true, effect: { function: () => { }, description: "" } }),
    new Card({ cost: 5, attack: 5, defense: 5, name: "Ancient Treant", image_url: drakeImage, isFoil: true, effect: { function: () => { }, description: "" } }),
    new Card({ cost: 5, attack: 6, defense: 4, name: "Volcanic Beast", image_url: drakeImage, isFoil: true, effect: { function: () => { }, description: "" } }),
    new Card({ cost: 6, attack: 7, defense: 5, name: "Thunder Lizard", image_url: drakeImage, isFoil: true, effect: { function: () => { }, description: "" } }),
    new Card({ cost: 6, attack: 6, defense: 6, name: "Titan Warrior", image_url: drakeImage, isFoil: true, effect: { function: () => { }, description: "" } }),
    new Card({ cost: 7, attack: 8, defense: 5, name: "Dragon Whelp", image_url: drakeImage, isFoil: true, effect: { function: () => { }, description: "" } }),
    new Card({ cost: 7, attack: 7, defense: 7, name: "Elder Basilisk", image_url: drakeImage, isFoil: false, effect: { function: () => { }, description: "" } }),
    new Card({ cost: 1, attack: 9, defense: 6, name: "Mountain Giant", image_url: drakeImage, isFoil: false, effect: { function: () => { }, description: "" } }),
    new Card({ cost: 1, attack: 8, defense: 8, name: "Dread Colossus", image_url: drakeImage, isFoil: false, effect: { function: () => { }, description: "" } }),
    new Card({ cost: 1, attack: 10, defense: 7, name: "Hellfire Dragon", image_url: drakeImage, isFoil: false, effect: { function: () => { }, description: "" } }),
    new Card({ cost: 1, attack: 9, defense: 9, name: "Void Hydra", image_url: drakeImage, isFoil: false, effect: { function: () => { }, description: "" } }),
    new Card({ cost: 1, attack: 12, defense: 8, name: "World Breaker", image_url: drakeImage, isFoil: false, effect: { function: () => { }, description: "" } }),
    new Card({ cost: 1, attack: 11, defense: 11, name: "Apocalypse Titan", image_url: drakeImage, isFoil: false, effect: { function: () => { }, description: "" } }),
];


