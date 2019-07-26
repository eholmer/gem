import GameState from "./gameState";
import GameEngine from "./gameEngine";
import PlayState from "./playState";
import {WIDTH, HEIGHT} from './constants'
import PlayStateHandler from "./playStateHandler";

export default class IntroState implements GameState {
    private readonly INTRO_DURATION_MS: number = 3000;
    private readonly FADEOUT_START_MS: number = this.INTRO_DURATION_MS - 1000;

    private startTime: number;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private playStateHandler: PlayStateHandler;
    private alpha: number;

    constructor(canvas: HTMLCanvasElement, playStateHandler: PlayStateHandler) {
        this.canvas = canvas;
        this.playStateHandler = playStateHandler;
        this.ctx = this.canvas.getContext('2d');
        this.alpha = 1;
    }

    init(): void {
        return;
    }

    update(gameEngine: GameEngine, timestamp: number): void {
        if (!this.startTime) {
            this.startTime = timestamp;
        }

        let elapsedTime = timestamp - this.startTime;
        if (elapsedTime > this.INTRO_DURATION_MS) {
            gameEngine.changeState(new PlayState(this.canvas, this.playStateHandler));
        }

        if (elapsedTime > this.FADEOUT_START_MS) {
            this.alpha = 1 - (elapsedTime - this.FADEOUT_START_MS) / (this.INTRO_DURATION_MS - this.FADEOUT_START_MS);
        }
    }
    
    draw(): void {
        this.clearCanvas();

        let color = 'rgba(255, 255, 255, ' + this.alpha + ')';

        this.ctx.font = '60px Arial';
        this.ctx.fillStyle = color;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('gem.', WIDTH / 2, HEIGHT / 2);

        // this.ctx.font = '15px Arial';
        // this.ctx.fillStyle = color;
        // this.ctx.textAlign = 'center';
        // this.ctx.textBaseline = 'middle';
        // this.ctx.fillText('by Erik Holmer', WIDTH / 2, HEIGHT / 2 + 60);
    }

	private clearCanvas(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}


}