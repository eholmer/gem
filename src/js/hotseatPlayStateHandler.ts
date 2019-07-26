import PlayStateHandler from "./playStateHandler";
import {State} from "./state"
import {Direction} from "./direction"
import StateUpdater from "./stateUpdater";
import {KEY_MAP, OTHER_KEY_MAP} from "./constants"

export default class HotseatPlayStateHandler implements PlayStateHandler {
    private state: State;
    private ready: boolean;

    constructor() {
        this.state = StateUpdater.initState(0, 0, 0);

		document.addEventListener("keydown", (event) => this.keydown(event), false);
		document.addEventListener("keyup", (event) => this.keyup(event), false);
    }

    public update(): boolean {
        if (!this.ready) {
            return false;
        }

        let ball = StateUpdater.updateBall(this.state.ball, this.state.pressedKeys);
        let otherBall = StateUpdater.updateBall(this.state.otherBall, this.state.otherPressedKeys);
        let winnerBall = StateUpdater.maybeWinnerBall(ball, otherBall);
        let score = this.state.score;
        let otherScore = this.state.otherScore;
        let gameNumber = this.state.gameNumber;
        
        if (winnerBall) {
            gameNumber += 1;
            score = winnerBall == ball ? score + 1 : score,
            otherScore = winnerBall == otherBall ? otherScore + 1 : otherScore
        }

        this.state = {
            ...this.state,
            ball,
            otherBall,
            winnerBall,
            score,
            otherScore,
            gameNumber
        }

        return true;
    }

    public latestState(): State {
        return this.state;
    }    


    public playerReady(): void {
        this.ready = true;
        this.state = StateUpdater.initState(this.state.score, this.state.otherScore, this.state.gameNumber);
    }

    private playerKeyUp(direction: Direction): void {
        this.state.pressedKeys.set(direction, false);
    }

    private playerKeyDown(direction: Direction): void {
        this.state.pressedKeys.set(direction, true);
    }

    private otherPlayerKeyUp(direction: Direction): void {
        this.state.otherPressedKeys.set(direction, false);
    }

    private otherPlayerKeyDown(direction: Direction): void {
        this.state.otherPressedKeys.set(direction, true);
    }

	private keydown(event: KeyboardEvent): void {
		if (KEY_MAP.has(event.keyCode)) {
			this.playerKeyDown(KEY_MAP.get(event.keyCode));
		}

		if (OTHER_KEY_MAP.has(event.keyCode)) {
			this.otherPlayerKeyDown(OTHER_KEY_MAP.get(event.keyCode));
		}
	}

	private keyup(event: KeyboardEvent): void {
		if (KEY_MAP.has(event.keyCode)) {
			this.playerKeyUp(KEY_MAP.get(event.keyCode));
		}

		if (OTHER_KEY_MAP.has(event.keyCode)) {
			this.otherPlayerKeyUp(OTHER_KEY_MAP.get(event.keyCode));
		}
	}
    
}