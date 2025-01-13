import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('messages') // prefixe toutes les routes de ce controller par /messages
export class MessagesController {
    constructor(private messagesService: MessagesService) { }

    // Route HTTP GET /messages/getMessages
    @Get()
    @UseGuards(AuthGuard) // Protège la route avec le guard
    getMessages() {
        // Appelle la méthode getMessages du service
        return this.messagesService.getMessages();
    }

    // Route HTTP POST /messages/crateMessage
    @Post('createMessage')
    @UseGuards(AuthGuard) // Protège la route avec le guard
    createMessage(
        // Récupère le contenu de la requête
        @Body('content') content: string,
        @Req() req
    ) {
        const senderId = req.user.userId;
        // Appelle la méthode createMessage du service
        return this.messagesService.createMessage(content, senderId);
    }

}
