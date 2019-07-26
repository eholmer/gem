import Peer from 'peerjs'
import Game from './game';
import ServerPlayStateHandler from './serverPlayStateHandler';
import GameEngine from './gameEngine';

export default class Server {

    static hostGameAndStart(): void {
        let peer = new Peer();
        let serverPlayStateHandler = new ServerPlayStateHandler();
        peer.on(
            'open',
            id => {
                document.getElementById("server-peer-id").innerHTML = id;
            }
        )
        peer.on(
            'connection',
            connection => {
                connection.on(
                    'data',
                    data => serverPlayStateHandler.handleClientInput(data));
                
                serverPlayStateHandler.registerStateHandler(data => connection.send(data));

                document.getElementById("myModal").style.display = "none";

                new Game(new GameEngine(serverPlayStateHandler)).gameLoop(0);
            })
    }

}