import PlayStateHandler from "./playStateHandler";
import {State} from "./state"
import {Direction} from "./direction"
import StateUpdater from "./stateUpdater"
import GameEvent from "./gameEvent"
import {KEY_MAP} from "./constants"

export default class ServerPlayStateHandler implements PlayStateHandler {
    private readonly gameEvent: GameEvent = new GameEvent();

    private state: State;
    private p1Ready: boolean;
    private p2Ready: boolean;

    constructor() {
        this.state = StateUpdater.initState(0, 0, 0);
        this.p1Ready = false;
        this.p2Ready = false;

		document.addEventListener("keydown", (event) => this.keydown(event), false);
		document.addEventListener("keyup", (event) => this.keyup(event), false);
    }

    public update(): void {
        if (!(this.p1Ready && this.p2Ready)) {
            return;
        }

        let ball = StateUpdater.updateBall(this.state.ball, this.state.pressedKeys);
        let otherBall = StateUpdater.updateBall(this.state.otherBall, this.state.otherPressedKeys);
        let winnerBall = StateUpdater.maybeWinnerBall(ball, otherBall);
        let score = this.state.score;
        let otherScore = this.state.otherScore;
        let gameNumber = this.state.gameNumber;
        
        if (winnerBall) {
            this.p1Ready = false;
            this.p2Ready = false;
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

        this.gameEvent.emit({state: JSON.stringify(this.state)});
    }

    public latestState(): State {
        return this.state;
    }    

    public playerReady(): void {
        this.p1Ready = true;
        if (this.p2Ready) {
            this.state = StateUpdater.initState(this.state.score, this.state.otherScore, this.state.gameNumber);
        }
    }

    public handleClientInput(data: any): void {
        if (data.hasOwnProperty("keyUp")) {
            this.otherPlayerKeyUp(JSON.parse(data.keyUp));
        } else if (data.hasOwnProperty("keyDown")) {
            this.otherPlayerKeyDown(JSON.parse(data.keyDown));
        } else if (data.hasOwnProperty("playerReady")) {
            this.otherPlayerReady();
        }
    }

    public registerStateHandler(handler: (data: any) => void) {
        return this.gameEvent.on(handler);
    }

    private otherPlayerReady(): void {
        this.p2Ready = true;
        if (this.p1Ready) {
            this.state = StateUpdater.initState(this.state.score, this.state.otherScore, this.state.gameNumber);
        }
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
	}

	private keyup(event: KeyboardEvent): void {
		if (KEY_MAP.has(event.keyCode)) {
			this.playerKeyUp(KEY_MAP.get(event.keyCode));
		}
    }
    
}