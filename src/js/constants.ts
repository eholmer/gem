import {Direction} from './direction'

export const MAX_FPS: number = 200;
export const TIMESTEP: number = 1000 / MAX_FPS;
export const WIDTH: number = 1024;
export const HEIGHT: number = 768;
export const BALL_RADIUS: number = 20;
export const BALL_COLOR: string = '#8f5454';
export const OTHER_BALL_COLOR: string = '#6c8f54';
export const BALL_ACCELERATION: number = 0.008;
export const BALL_BREAK_FACTOR: number = 0.95;
export const HEALTH_REGAIN_RATE: number = 0.06;
export const WALL_BOUNCE_PENALY: number = 25;
export const KEY_MAP: Map<number, Direction> = new Map<number, Direction>([
    [39, Direction.Right],
    [37, Direction.Left],
    [38, Direction.Up],
    [40, Direction.Down],
    [32, Direction.Break]]);
export const OTHER_KEY_MAP: Map<number, Direction> = new Map<number, Direction>([
    [68, Direction.Right],
    [65, Direction.Left],
    [87, Direction.Up],
    [83, Direction.Down],
    [16, Direction.Break]]);