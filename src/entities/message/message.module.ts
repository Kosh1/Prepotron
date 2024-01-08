import { Module } from '@nestjs/common';
import { MessageService } from './message.service';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   {
    //     name: Session.name,
    //     schema: SessionSchema,
    //   },
    // ]),
  ],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
