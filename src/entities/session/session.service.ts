import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from './schemas/session.schema';
import { Model } from 'mongoose';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { ulid } from 'ulid';

@Injectable()
export class SessionService {
  constructor(
    // @InjectRepository(Session)
    // private readonly sessionRepository: Repository<Session>,
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
  ) {}

  async getSession(sessionId: string): Promise<Session> {
    let session = await this.findOne(sessionId);
    if (!session) {
      session = await this.create({ user: 'testUser', id: ulid() });
      console.log('Session not found, creating new one');
    }

    return session;
  }

  findOne(id: string): Promise<Session | null> {
    return this.sessionModel.findOne({ id }).exec();
  }

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    return await this.sessionModel.create(createSessionDto);
  }

  findMany({}) {
    return {} as any;
  }

  update(id: string, updateSessionDto: UpdateSessionDto) {
    return this.sessionModel.updateOne({ id }, updateSessionDto);
  }

  softDelete({}) {
    return {} as any;
  }
  // async softDelete({
  //   excludeId,
  //   ...criteria
  // }: {
  //   id?: Session['id'];
  //   user?: Pick<User, 'id'>;
  //   excludeId?: Session['id'];
  // }): Promise<void> {
  //   await this.sessionRepository.softDelete({
  //     ...criteria,
  //     id: criteria.id ? criteria.id : excludeId ? Not(excludeId) : undefined,
  //   });
  // }
}
