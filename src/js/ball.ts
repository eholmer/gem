export default class Ball {
    readonly posX: number;
    readonly posY: number;
    readonly velX: number;
    readonly velY: number;
    readonly color: string;
    readonly name: string;

    constructor(posX: number, posY: number, velX: number, velY: number, color: string, name: string) {
        this.posX = posX;
        this.posY = posY;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.name = name;
    }
}