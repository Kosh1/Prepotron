import { Message } from 'src/entities/message/schemas/message.schema';

export class UpdateSessionDto {
  readonly id: string;
  readonly user: any; // FIXME: should be User
  readonly createdAt: Date;
  readonly updatedAt?: Date;
  readonly messages?: Array<Message>;
}
