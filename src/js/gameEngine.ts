import GameState from "./gameState";
import IntroState from "./introState";
import {HEIGHT, WIDTH} from "./constants"
import PlayStateHandler from "./playStateHandler";

export default class GameEngine {
    private gameState: GameState;

    constructor(playStateHandler: PlayStateHandler) {
		let canvas = <HTMLCanvasElement>document.getElementById('canvas');
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
        this.gameState = new IntroState(canvas, playStateHandler)
    }

    changeState(gameState: GameState): void {
        gameState.init();
        this.gameState = gameState;
    }

    update(timestamp: number): void {
        this.gameState.update(this, timestamp);
    }

    draw(): void {
        this.gameState.draw();
    }

}