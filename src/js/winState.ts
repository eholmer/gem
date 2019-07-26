import GameState from "./gameState";
import GameEngine from "./gameEngine";
import PlayState from "./playState";
import {WIDTH, HEIGHT} from './constants'

export default class WinState implements GameState {
    private readonly WIN_DURATION: number = 1500;
    private readonly FADEOUT_START_MS: number = this.WIN_DURATION - 500;

    private startTime: number;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private alpha: number;
    private winnerName: string;
    private winnerColor: string;
    private playState: PlayState;

    constructor(startTime: number, canvas: HTMLCanvasElement, winnerName: string, winnerColor: string, playState: PlayState) {
        this.startTime = startTime;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.alpha = 1;
        this.winnerName = winnerName;
        this.winnerColor = winnerColor;
        this.playState = playState;
    }

    init(): void {
        return;
    }

    update(gameEngine: GameEngine, timestamp: number): void {
        let elapsedTime = timestamp - this.startTime;
        if (elapsedTime > this.WIN_DURATION) {
            gameEngine.changeState(this.playState);
        }

        if (elapsedTime > this.FADEOUT_START_MS) {
            this.alpha = 1 - (elapsedTime - this.FADEOUT_START_MS) / (this.WIN_DURATION - this.FADEOUT_START_MS);
        }
    }
    
    draw(): void {
        this.clearCanvas();

        let color = this.hexToRGBA(this.winnerColor, this.alpha);

        this.ctx.font = '80px times new roman bold';
        this.ctx.fillStyle = color;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.winnerName + " wins.", WIDTH / 2, HEIGHT / 2);
    }

	private clearCanvas(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    private hexToRGBA(hexColor: string, alpha: number): string {
        let r = "0x" + hexColor[1] + hexColor[2];
        let g = "0x" + hexColor[3] + hexColor[4];
        let b = "0x" + hexColor[5] + hexColor[6];

        return "rgba("+ +r + ", " + +g + ", " + +b + "," + alpha + ")";
      }


}