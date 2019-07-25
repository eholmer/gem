import GameEngine from './gameEngine';

export default interface GameState {
    update(gameEngine: GameEngine, timestamp: number): void;
    draw(): void;
}