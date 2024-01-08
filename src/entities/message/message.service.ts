import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { FindOptions } from 'src/utils/types/find-options.type';
// import { DeepPartial, Not, Repository } from 'typeorm';
// import { Message } from './entities/message.entity';
// import { NullableType } from '../../utils/types/nullable.type';
// import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MessageService {
  constructor() {}

  // async findOne(options: FindOptions<Message>): Promise<NullableType<Message>> {
  //   return this.messageRepository.findOne({
  //     where: options.where,
  //   });
  // }

  // async findMany(options: FindOptions<Message>): Promise<Message[]> {
  //   return this.messageRepository.find({
  //     where: options.where,
  //   });
  // }

  // async create(data: DeepPartial<Message>): Promise<Message> {
  //   return this.messageRepository.save(this.messageRepository.create(data));
  // }

  // async softDelete({
  //   excludeId,
  //   ...criteria
  // }: {
  //   id?: Message['id'];
  //   user?: Pick<User, 'id'>;
  //   excludeId?: Message['id'];
  // }): Promise<void> {
  //   await this.messageRepository.softDelete({
  //     ...criteria,
  //     id: criteria.id ? criteria.id : excludeId ? Not(excludeId) : undefined,
  //   });
  // }
}
