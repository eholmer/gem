import {Ball} from "./ball"
import {State} from "./state"
import {Direction} from "./direction"
import {
    TIMESTEP,
    WIDTH,
    HEIGHT,
    BALL_COLOR,
    OTHER_BALL_COLOR,
    BALL_ACCELERATION,
    BALL_BREAK_FACTOR,
    HEALTH_REGAIN_RATE,
    BALL_RADIUS,
    WALL_BOUNCE_PENALY
} from './constants'

export default class StateUpdater {

    constructor() {}

    static initState(score: number, otherScore: number, gameNumber: number): State {
		let ball: Ball = {
			posX: WIDTH / 4,
			posY: HEIGHT / 2,
			velX: 0,
			velY: 0,
			color: BALL_COLOR,
			name: "Player 1",
			health: 100
		};

		let otherBall: Ball = {
			posX: 3 * WIDTH / 4,
			posY: HEIGHT / 2,
			velX: 0,
			velY: 0,
			color: OTHER_BALL_COLOR,
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
			winnerBall: undefined,
			gameNumber: gameNumber
		}
	}

    static maybeWinnerBall(ball: Ball, otherBall: Ball): Ball | undefined {
		if (this.isCollision(ball, otherBall)) {
			return this.winnerBall(ball, otherBall);
		} else if (ball.health == 0) {
            return otherBall;
		} else if (otherBall.health == 0) {
            return ball;
        }
        
        return undefined;
    }

	private static isCollision(ball: Ball, otherBall: Ball): boolean {
		return (ball.posX - otherBall.posX) ** 2 + (ball.posY - otherBall.posY) ** 2 < (2 * BALL_RADIUS) ** 2;
	}

	static updateBall(ball: Ball, pressedKeys: Map<Direction, boolean>): Ball {
		let {posX, posY, velX, velY, health} = ball;

		if (pressedKeys.get(Direction.Up)) {
			velY -= BALL_ACCELERATION;
		}

		if (pressedKeys.get(Direction.Down)) {
			velY += BALL_ACCELERATION;
		}

		if (pressedKeys.get(Direction.Left)) {
			velX -= BALL_ACCELERATION;
		}

		if (pressedKeys.get(Direction.Right)) {
			velX += BALL_ACCELERATION;
		}

		if (pressedKeys.get(Direction.Break)) {
			velX *= BALL_BREAK_FACTOR;
			velY *= BALL_BREAK_FACTOR;
		}

		health = Math.min(100, health + HEALTH_REGAIN_RATE);

		posX = this.nextBallPos(posX, velX);
		if (this.isWallBounce(posX, velX, WIDTH)) {
			posX = this.bounceBall(posX, velX, velX > 0 ? WIDTH - BALL_RADIUS : BALL_RADIUS);
			velX = -velX;
			health = Math.max(0, health - WALL_BOUNCE_PENALY);
		} 

		posY = this.nextBallPos(posY, velY);
		if (this.isWallBounce(posY, velY, HEIGHT)) {
			posY = this.bounceBall(posY, velY, velY > 0 ? HEIGHT - BALL_RADIUS : BALL_RADIUS);
			velY = -velY;
			health = Math.max(0, health - WALL_BOUNCE_PENALY);
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

    private static bounceBall(pos: number, vel: number, limit: number): number {
		return 2 * limit - pos;
	}

	private static isWallBounce(pos: number, vel: number, limit: number): boolean {
		return pos + BALL_RADIUS >= limit || pos - BALL_RADIUS <= 0;
	}

	private static nextBallPos(pos: number, vel: number): number {
		return pos + vel * TIMESTEP;
    }

	private static winnerBall(ball: Ball, otherBall: Ball) {
		let a = ball.velX ** 2 + ball.velY ** 2;
		let b = otherBall.velX ** 2 + otherBall.velY ** 2;

		if (a > b) {
			return ball;
		}
		
		return otherBall;
    }

}