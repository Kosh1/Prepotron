import { Message } from 'src/entities/message/schemas/message.schema';

export class CreateChatRoomDto {
  readonly messages?: Array<Message>;
}
