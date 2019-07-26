export default class GameEvent {
    private handlers: { (data: any): void; }[] = [];

    public on(handler: { (data: any): void }) : void {
        this.handlers.push(handler);
    }

    public emit(data: any) {
        this.handlers.slice(0).forEach(h => h(data));
    }
}