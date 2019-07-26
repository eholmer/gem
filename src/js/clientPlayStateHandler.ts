import PlayStateHandler from "./playStateHandler";
import {State} from "./state"
import {Direction} from "./direction"
import StateUpdater from "./stateUpdater"
import GameEvent from "./gameEvent";
import {KEY_MAP} from "./constants"

export default class ClientPlayStateHandler implements PlayStateHandler {
    private readonly gameEvent: GameEvent = new GameEvent();

    private state: State;

    constructor() {
        this.state = StateUpdater.initState(0, 0, 0);

		document.addEventListener("keydown", (event) => this.keydown(event), false);
		document.addEventListener("keyup", (event) => this.keyup(event), false);
    }

    public update(): boolean {
        return true;
    }

    public latestState(): State {
        return this.state;
    }    

    public playerReady(): void {
       this.gameEvent.emit({playerReady: true}) 
    }

    public handleServerInput(data: any): void {
        if (data.hasOwnProperty("state")) {
            this.state = JSON.parse(data.state);
        }
    }

    public registerStateHandler(handler: (data: any) => void) {
        return this.gameEvent.on(handler);
    }

    private playerKeyUp(direction: Direction): void {
        this.gameEvent.emit({keyUp: JSON.stringify(direction)})
    }

    private playerKeyDown(direction: Direction): void {
        this.gameEvent.emit({keyDown: JSON.stringify(direction)})
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