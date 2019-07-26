import {Ball} from './ball'
import {State} from './state'
import GameState from './gameState'
import GameEngine from './gameEngine'
import WinState from './winState'
import PlayStateHandler from './playStateHandler'
import {BALL_COLOR, OTHER_BALL_COLOR, BALL_RADIUS} from './constants'

export default class PlayState implements GameState {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private playStateHandler: PlayStateHandler;
	private playerHealthBar: HTMLElement;
	private otherPlayerHealthBar: HTMLElement;
	private playerScore: HTMLElement;
	private otherPlayerScore: HTMLElement;
	private state: State;
	private gameNumber: number;

	constructor(canvas: HTMLCanvasElement, playStateHandler: PlayStateHandler) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
		this.playStateHandler = playStateHandler;
		this.gameNumber = 0;

		this.playerHealthBar = document.getElementById("p1-health");
		this.otherPlayerHealthBar = document.getElementById("p2-health");
		this.playerHealthBar.style.backgroundColor = BALL_COLOR;
		this.playerHealthBar.style.height = "100%";
		this.otherPlayerHealthBar.style.height = "100%";
		this.otherPlayerHealthBar.style.backgroundColor = OTHER_BALL_COLOR;

		document.getElementById("score").style.display = "flex";
		this.playerScore = document.getElementById("p1-score");
		this.otherPlayerScore = document.getElementById("p2-score");
		this.playerScore.style.color = BALL_COLOR;
		this.otherPlayerScore.style.color = OTHER_BALL_COLOR;
	}

	public init() {
		this.playStateHandler.playerReady();
	}

	public update(gameEngine: GameEngine, timestamp: number): void {
		this.playStateHandler.update();
		this.state = this.playStateHandler.latestState();

		if (this.state.winnerBall && this.gameNumber != this.state.gameNumber) {
			this.gameNumber += 1;
			this.draw();
			gameEngine.changeState(new WinState(timestamp, this.canvas, this.state.winnerBall.name, this.state.winnerBall.color, this)); 
		}

	}

	public draw(): void {
		this.clearCanvas();
		this.drawScore(this.state.score, this.state.otherScore)
		this.drawBall(this.state.ball, this.playerHealthBar);	
		this.drawBall(this.state.otherBall, this.otherPlayerHealthBar);	
	} 

	private drawScore(score: number, otherScore: number) {
		this.playerScore.innerHTML = score.toString();
		this.otherPlayerScore.innerHTML = otherScore.toString();
	}

	private drawBall(ball: Ball, playerHealthBar: HTMLElement) {
		this.ctx.beginPath();
		this.ctx.arc(ball.posX, ball.posY, BALL_RADIUS, 0, Math.PI * 2, false);
		this.ctx.fillStyle = ball.color;
		this.ctx.fill();
		this.ctx.closePath();

		playerHealthBar.style.height = ball.health + "%";
	}

	private clearCanvas(): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

}

