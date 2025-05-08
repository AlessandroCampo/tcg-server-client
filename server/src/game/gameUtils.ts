export function diceRoll(): number {
    const roll1 = Math.floor(Math.random() * 6);
    const roll2 = Math.floor(Math.random() * 6);
    return roll1 >= roll2 ? 0 : 1;
}

export function shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
