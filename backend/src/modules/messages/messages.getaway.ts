import { WebSocketGateway, SubscribeMessage, MessageBody, WsResponse } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
    cors: {
      origin: 'http://localhost:5173', // Autorise uniquement cette origine
      methods: ['GET', 'POST'], // Méthodes autorisées
      allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
    },
  })
@Injectable()
export class MessageGateway {
    // Émettre un événement sur tous les clients
    emitMessage(action: string, message: any) {
        this.server.emit('messages', { action, message });
    }

    // Recevoir un message
    @SubscribeMessage('messages')
    handleMessage(client: Socket, @MessageBody() data: any): WsResponse<any> {
        // Traitement du message ici si nécessaire, sinon tu peux juste le passer
        return { event: 'messages', data };
    }

    // Définir le serveur pour l'émission
    private server;
    afterInit(server: any) {
        this.server = server;
    }
}
