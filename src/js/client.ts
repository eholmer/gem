import Peer from 'peerjs'
import ClientPlayStateHandler from './clientPlayStateHandler';
import Game from './game';
import GameEngine from './gameEngine';

export default class Client {

    static connectAndStartGame(peerId: string): void {
        let peer = new Peer();
        let clientPlayStateHandler = new ClientPlayStateHandler();
        let connection = peer.connect(peerId);
        connection.on(
            'open',
            () => {
                connection.on(
                    'data',
                    data => clientPlayStateHandler.handleServerInput(data));

                clientPlayStateHandler.registerStateHandler(data => connection.send(data));

                document.getElementById("myModal").style.display = "none";

                new Game(new GameEngine(clientPlayStateHandler)).gameLoop(0);
            }
        )
    }


}