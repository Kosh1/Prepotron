import { Module } from '@nestjs/common';
import { ChatRoomService } from './chatRoom.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoomSchema, ChatRoom } from './schemas/chatroom.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ChatRoom.name,
        schema: ChatRoomSchema,
      },
    ]),
  ],
  providers: [ChatRoomService],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
