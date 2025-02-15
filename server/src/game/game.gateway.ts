import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayInit {
  constructor(private readonly gameService: GameService) {}

  afterInit(server: any) {
    console.log('GameGateway initialized');
  }

  @SubscribeMessage('startGame')
  handleStartGame(
    @MessageBody() data: { N: number; M: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Входящие данные:', data); 
    const gameState = this.gameService.createGame(data.N, data.M);
    console.log('Начальное состояние игры:', gameState.board); 
    client.emit('move', gameState);
  }

  @SubscribeMessage('makeMove')
  handleMakeMove(
    @MessageBody() data: { row: number; col: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Входящие данные:', data);
    const gameState = this.gameService.makeMove(data.row, data.col);
    if (gameState) {
      console.log('Входящие данные:', gameState.board); 
      client.broadcast.emit('move', gameState);
      client.emit('move', gameState);
    }
  }
}
