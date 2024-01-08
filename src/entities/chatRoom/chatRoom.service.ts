import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from './schemas/chatroom.schema';
import { Model } from 'mongoose';
import { CreateChatRoomDto } from './dto/createChatroom.dto';
import { UpdateChatRoomDto } from './dto/updateChatroom.dto';
import { ulid } from 'ulid';
import { InitialPrompt, PromptType } from 'src/prompt/interfaces/prompt.interface';
import { Message } from '../message/schemas/message.schema';
import { toUserMessage } from 'src/assistant/utils/adapters';
import { ValidatedChatMessage } from '../../assistant/interfaces/assistant.interface';

@Injectable()
export class ChatRoomService {
  constructor(@InjectModel(ChatRoom.name) private readonly chatRoomModel: Model<ChatRoom>) {}

  findOne(id: string): Promise<ChatRoom | null> {
    return this.chatRoomModel.findOne({ id }).exec();
  }

  create(params?: CreateChatRoomDto): Promise<ChatRoom> {
    return this.chatRoomModel.create({ messages: params?.messages, id: ulid() });
  }

  update(id: string, updateChatRoomDto: UpdateChatRoomDto) {
    return this.chatRoomModel.updateOne({ id }, updateChatRoomDto);
  }

  static addUserMessage(chatRoom: ChatRoom, message: string) {
    const userMessage = toUserMessage(message);
    chatRoom.messages.push(new Message(userMessage.role, userMessage.content));
    return chatRoom;
  }

  static addResponseMessage(chatRoom: ChatRoom, message: ValidatedChatMessage) {
    chatRoom.messages.push(message);
    return chatRoom;
  }

  static changeInitialPrompt(chatRoom: ChatRoom, newInitialPrompt: InitialPrompt | null, type: PromptType) {
    if (!newInitialPrompt) return chatRoom;

    let firstMessage = chatRoom.messages[0];
    if (firstMessage?.role !== 'system') {
      throw new Error('First message is not a system message');
    }

    firstMessage = new Message('system', newInitialPrompt.system.content);
    chatRoom.messages[0] = firstMessage;
    chatRoom.prompt = type;
    return chatRoom;
  }
}
