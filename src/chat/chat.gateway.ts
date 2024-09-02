import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { log } from 'console';

@WebSocketGateway(3002, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    client.broadcast.emit('user-joined', {
      MessageBody: `new user joined the chat :${client.id}`,
    });
    // this.server.emit('user-joined', {
    //   message: `user joined the chat ${client.id}`,
    // });
  }

  handleDisconnect(client: any) {
    this.server.emit('user-left', {
      message: `user left the chat ${client.id}`,
    });
  }

  @SubscribeMessage('newMessage')
  create(@MessageBody() message: string) {
    this.server.emit('message', message);
  }
}
