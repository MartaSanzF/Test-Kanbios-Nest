import { Injectable } from '@nestjs/common';
import { Message } from '../../schemas/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageGateway } from './messages.getaway';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {

    constructor(
        @InjectModel('Message') private messageModel: Model<Message>,
        @InjectRepository(User) private usersRepository: Repository<User>,
        private messageGateway: MessageGateway
) { }

    async getMessages() {

        try {
            const messages = await this.messageModel.find();
            return messages;
        }
        catch (error) {
            throw new Error(error);
        }
    }

    async createMessage(content: string, senderId: string) {

        const user =  await this.usersRepository.findOne({ where: { id: senderId } });

        const message = new this.messageModel({
            content: content,
            senderName: user.name,
            senderId: user.id,
            status: 'sent'
        });

        try {
            const result = await message.save();

            this.messageGateway.emitMessage('create', result);

            return result;
        }
        catch (error) {
            throw new Error(error);
        }
    }
}