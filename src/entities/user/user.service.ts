import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { NullableType } from '../../utils/types/nullable.type';
import { TestUser } from './config/user';

@Injectable()
export class UserService {
  constructor() {} // private usersRepository: Repository<User>,

  create(createProfileDto: CreateUserDto): Promise<User> {
    console.log(createProfileDto);
    return {} as any;
  }

  findOne(id: string): Promise<NullableType<User>> {
    if (!id) return Promise.resolve(null);

    return Promise.resolve(TestUser);
  }

  // findManyWithPagination(paginationOptions: IPaginationOptions): Promise<User[]> {
  //   return this.usersRepository.find({
  //     skip: (paginationOptions.page - 1) * paginationOptions.limit,
  //     take: paginationOptions.limit,
  //   });
  // }

  // update(id: User['id'], payload: DeepPartial<User>): Promise<User> {
  //   return this.usersRepository.save(
  //     this.usersRepository.create({
  //       id,
  //       ...payload,
  //     }),
  //   );
  // }

  // async softDelete(id: User['id']): Promise<void> {
  //   await this.usersRepository.softDelete(id);
  // }
}
