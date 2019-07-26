import {State} from './state'

export default interface PlayStateHandler {

    update(): void;

    latestState(): State;

    playerReady(): void;
}