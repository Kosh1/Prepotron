import { Message } from 'src/entities/message/schemas/message.schema';

export class UpdateChatRoomDto {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt?: Date;
  readonly messages?: Array<Message>;
}
