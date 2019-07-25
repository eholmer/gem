import {Direction} from './direction'
import GameState from './gameState'
import GameEngine from './gameEngine'
import WinState from './winState'
import {TIMESTEP, WIDTH, HEIGHT} from './constants'

export default class PlayState implements GameState {
	private readonly BALL_RADIUS: number = 20;
	private readonly BALL_COLOR: string = '#8f5454';
	private readonly OTHER_BALL_COLOR: string = '#6c8f54';
	private readonly BALL_ACCELERATION: number = 0.008;
	private readonly BALL_BREAK_FACTOR: number = 0.95;
	private readonly HEALTH_REGAIN_RATE: number = 0.06;
	private readonly WALL_BOUNCE_PENALY: number = 25;
	private readonly KEY_MAP: Map<number, Direction> = new Map<number, Direction>([
		[68, Direction.Right],
		[65, Direction.Left],
		[87, Direction.Up],
		[83, Direction.Down],
		[16, Direction.Break]]);
	private readonly OTHER_KEY_MAP: Map<number, Direction> = new Map<number, Direction>([
		[39, Direction.Right],
		[37, Direction.Left],
		[38, Direction.Up],
		[40, Direction.Down],
		[32, Direction.Break]]);

	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private state: State;
	private playerHealthBar: HTMLElement;
	private otherPlayerHealthBar: HTMLElement;
	private playerScore: HTMLElement;
	private otherPlayerScore: HTMLElement;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
		this.state = this.initState(0, 0);

		document.addEventListener("keydown", (event) => this.keydown(event), false);
		document.addEventListener("keyup", (event) => this.keyup(event), false);

		this.playerHealthBar = document.getElementById("p1-health");
		this.otherPlayerHealthBar = document.getElementById("p2-health");
		this.playerHealthBar.style.backgroundColor = this.BALL_COLOR;
		this.playerHealthBar.style.height = "100%";
		this.otherPlayerHealthBar.style.height = "100%";
		this.otherPlayerHealthBar.style.backgroundColor = this.OTHER_BALL_COLOR;

		document.getElementById("score").style.display = "flex";
		this.playerScore = document.getElementById("p1-score");
		this.otherPlayerScore = document.getElementById("p2-score");
		this.playerScore.style.color = this.BALL_COLOR;
		this.otherPlayerScore.style.color = this.OTHER_BALL_COLOR;
	}

	public update(gameEngine: GameEngine, timestamp: number): void {
		if (this.isCollision(this.state.ball, this.state.otherBall)) {
			let winnerBall: Ball = this.winnerBall(this.state);
			if (winnerBall == this.state.ball) {
				this.state = this.initState(this.state.score + 1, this.state.otherScore);
			} else {
				this.state = this.initState(this.state.score, this.state.otherScore + 1);
			}

			gameEngine.changeState(new WinState(timestamp, this.canvas, winnerBall.name, winnerBall.color, this))
		} else if (this.state.ball.health == 0) {
			this.state = this.initState(this.state.score, this.state.otherScore + 1);
			gameEngine.changeState(new WinState(timestamp, this.canvas, this.state.otherBall.name, this.state.otherBall.color, this))
		} else if (this.state.otherBall.health == 0) {
			this.state = this.initState(this.state.score + 1, this.state.otherScore);
			gameEngine.changeState(new WinState(timestamp, this.canvas, this.state.ball.name, this.state.ball.color, this))
		}

		else {
			this.state = {
				...this.state,
				ball: this.updateBall(this.state.ball, this.state.pressedKeys),
				otherBall: this.updateBall(this.state.otherBall, this.state.otherPressedKeys)
			}
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
		this.ctx.arc(ball.posX, ball.posY, this.BALL_RADIUS, 0, Math.PI * 2, false);
		this.ctx.fillStyle = ball.color;
		this.ctx.fill();
		this.ctx.closePath();

		playerHealthBar.style.height = ball.health + "%";
	}

	private updateBall(ball: Ball, pressedKeys: Map<Direction, boolean>): Ball {
		let {posX, posY, velX, velY, health} = ball;

		if (pressedKeys.get(Direction.Up)) {
			velY -= this.BALL_ACCELERATION;
		}

		if (pressedKeys.get(Direction.Down)) {
			velY += this.BALL_ACCELERATION;
		}

		if (pressedKeys.get(Direction.Left)) {
			velX -= this.BALL_ACCELERATION;
		}

		if (pressedKeys.get(Direction.Right)) {
			velX += this.BALL_ACCELERATION;
		}

		if (pressedKeys.get(Direction.Break)) {
			velX *= this.BALL_BREAK_FACTOR;
			velY *= this.BALL_BREAK_FACTOR;
		}

		health = Math.min(100, health + this.HEALTH_REGAIN_RATE);

		posX = this.nextBallPos(posX, velX);
		if (this.isWallBounce(posX, velX, WIDTH)) {
			posX = this.bounceBall(posX, velX, velX > 0 ? WIDTH - this.BALL_RADIUS : this.BALL_RADIUS);
			velX = -velX;
			health = Math.max(0, health - this.WALL_BOUNCE_PENALY);
		} 

		posY = this.nextBallPos(posY, velY);
		if (this.isWallBounce(posY, velY, HEIGHT)) {
			posY = this.bounceBall(posY, velY, velY > 0 ? HEIGHT - this.BALL_RADIUS : this.BALL_RADIUS);
			velY = -velY;
			health = Math.max(0, health - this.WALL_BOUNCE_PENALY);
		}

		return {
			...ball,
			posX,
			posY,
			velX,
			velY,
			health
		}
	}

	private bounceBall(pos: number, vel: number, limit: number): number {
		return 2 * limit - pos;
	}

	private isWallBounce(pos: number, vel: number, limit: number): boolean {
		return pos + this.BALL_RADIUS >= limit || pos - this.BALL_RADIUS <= 0;
	}

	private isCollision(ball: Ball, otherBall: Ball): boolean {
		return (ball.posX - otherBall.posX) ** 2 + (ball.posY - otherBall.posY) ** 2 < (2 * this.BALL_RADIUS) ** 2;
	}

	private clearCanvas(): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	private nextBallPos(pos: number, vel: number): number {
		return pos + vel * TIMESTEP;
	}

	private initState(score: number, otherScore: number): State {
		let ball: Ball = {
			posX: WIDTH / 4,
			posY: HEIGHT / 2,
			velX: 0,
			velY: 0,
			color: this.BALL_COLOR,
			name: "Player 1",
			health: 100
		};

		let otherBall: Ball = {
			posX: 3 * WIDTH / 4,
			posY: HEIGHT / 2,
			velX: 0,
			velY: 0,
			color: this.OTHER_BALL_COLOR,
			name: "Player 2",
			health: 100
		};

		return {
			ball,
			otherBall,
			pressedKeys: new Map<Direction, boolean>([
				[Direction.Right, false],
				[Direction.Left, false],
				[Direction.Up, false],
				[Direction.Down, false]]),
			otherPressedKeys: new Map<Direction, boolean>([
				[Direction.Right, false],
				[Direction.Left, false],
				[Direction.Up, false],
				[Direction.Down, false]]),
			lastRender: 0,
			score,
			otherScore,
		}
	}

	private keydown(event: KeyboardEvent): void {
		if (this.KEY_MAP.has(event.keyCode)) {
			this.state.pressedKeys.set(this.KEY_MAP.get(event.keyCode), true);
		}

		if (this.OTHER_KEY_MAP.has(event.keyCode)) {
			this.state.otherPressedKeys.set(this.OTHER_KEY_MAP.get(event.keyCode), true);
		}
	}

	private keyup(event: KeyboardEvent): void {
		if (this.KEY_MAP.has(event.keyCode)) {
			this.state.pressedKeys.set(this.KEY_MAP.get(event.keyCode), false);
		}

		if (this.OTHER_KEY_MAP.has(event.keyCode)) {
			this.state.otherPressedKeys.set(this.OTHER_KEY_MAP.get(event.keyCode), false);
		}
	}

	private winnerBall(state: State) {
		let a = state.ball.velX ** 2 + state.ball.velY ** 2;
		let b = state.otherBall.velX ** 2 + state.otherBall.velY ** 2;

		if (a > b) {
			return state.ball;
		}
		
		return state.otherBall;
	}

}

type Ball = {
    readonly posX: number;
    readonly posY: number;
    readonly velX: number;
    readonly velY: number;
    readonly color: string;
	readonly name: string;
	readonly health: number;
}

type State = {
   readonly ball: Ball; 
   readonly otherBall: Ball; 
   readonly pressedKeys: Map<Direction, boolean>;
   readonly otherPressedKeys: Map<Direction, boolean>;
   readonly lastRender: number;
   readonly score: number;
   readonly otherScore: number
}
