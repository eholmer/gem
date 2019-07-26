import {Ball} from './ball'
import {Direction} from './direction'

export type State = {
   readonly ball: Ball; 
   readonly otherBall: Ball; 
   readonly pressedKeys: Map<Direction, boolean>;
   readonly otherPressedKeys: Map<Direction, boolean>;
   readonly lastRender: number;
   readonly score: number;
   readonly otherScore: number
   readonly winnerBall: Ball | undefined;
   readonly gameNumber: number;
}