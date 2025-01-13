import { Schema } from 'mongoose';

export const MessageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'read'],
        default: 'pending'
    },
    senderName: {
        type: String,
        required: true
    },
    senderId: {
        type: String,
        required: true
    }
});

export interface Message {
    content: string;
    createdAt: Date;
    status: string;
    senderName: string;
    senderId: string;
}