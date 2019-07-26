import GameEngine from './gameEngine';

export default interface GameState {
    init(): void;
    update(gameEngine: GameEngine, timestamp: number): void;
    draw(): void;
}