import GameEngine from './gameEngine';
import {TIMESTEP} from './constants'

export default class Game {
    private lastRender: number;
    private gameEngine: GameEngine;

    constructor(gameEngine: GameEngine) {
        this.gameEngine = gameEngine;
        this.lastRender = 0;
    }

	public gameLoop(timestamp: number): void {
		let delta: number = timestamp - this.lastRender;

		while (delta >= TIMESTEP) {
			this.gameEngine.update(timestamp);
			delta -= TIMESTEP;
		}

		this.gameEngine.draw();
		this.lastRender = timestamp;
		requestAnimationFrame((ts) => this.gameLoop(ts)); 
	}
}