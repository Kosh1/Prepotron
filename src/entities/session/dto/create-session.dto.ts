import { Message } from 'src/entities/message/schemas/message.schema';

export class CreateSessionDto {
  readonly user: string;
  readonly id: string;
  readonly messages?: Array<Message>;
}
