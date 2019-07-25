import GameState from "./gameState";
import IntroState from "./introState";
import {HEIGHT, WIDTH} from "./constants"

export default class GameEngine {
    private gameState: GameState;

    constructor() {
		let canvas = <HTMLCanvasElement>document.getElementById('canvas');
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
        this.gameState = new IntroState(0, canvas)
    }

    changeState(gameState: GameState): void {
        this.gameState = gameState;
    }

    update(timestamp: number): void {
        this.gameState.update(this, timestamp);
    }

    draw(): void {
        this.gameState.draw();
    }

}