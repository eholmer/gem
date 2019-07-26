declare var require: any;
require('../css/main.css');

import GameEngine from './gameEngine';
import Server from './server'
import Client from './client'
import Game from './game'
import HotseatPlayStateHandler from './hotseatPlayStateHandler'

class App {
    constructor() {}

	public setup(): void {
		document.getElementById("hotseat").onclick = e => {
			document.getElementById("myModal").style.display = "none";
			let game = new Game(new GameEngine(new HotseatPlayStateHandler()));
			game.gameLoop(0);
		}

		document.getElementById("server-start").onclick = e => {
			document.getElementById("server-info").style.display = "block"
			Server.hostGameAndStart();
		}

		document.getElementById("server-join").onclick = e => {
			let id: string = (<HTMLInputElement> document.getElementById("server-join-id")).value;
			Client.connectAndStartGame(id);
		}

	}
}

window.onload = () => {
	let app = new App();
	app.setup();
}