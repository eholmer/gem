declare var require: any;
require('../css/main.css');

import GameEngine from './gameEngine';
import {TIMESTEP} from './constants'

class App {
	private gameEngine: GameEngine;
	private lastRender: number;

    constructor(gameEngine: GameEngine) {
		this.gameEngine = gameEngine;
		this.lastRender = 0;
    }

	public setup(): void {
		this.gameLoop(0);
	}

	private gameLoop(timestamp: number): void {
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

window.onload = () => {
	let app = new App(new GameEngine());

	app.setup();
}