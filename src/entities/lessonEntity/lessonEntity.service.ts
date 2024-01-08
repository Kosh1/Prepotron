import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lesson } from './schemas/lesson.schema';
import { User } from '../user/entities/user.entity';
import { testLesson } from './config/testLesson';
import { ulid } from 'ulid';
import { ChatRoom } from '../chatRoom/schemas/chatroom.schema';
import { UpdateLessonDto } from './dto/updateLesson.dto';

@Injectable()
export class LessonEntityService {
  constructor(@InjectModel(Lesson.name) private readonly lessonModel: Model<Lesson>) {}

  async findOne(id: string): Promise<Lesson | null> {
    const lessonWithChatroom = await this.lessonModel.findOne({ id }).populate('chatRoom').exec();
    if (!lessonWithChatroom) throw new Error('Lesson not found');
    return lessonWithChatroom.toObject();
  }

  async create(user: User, chatRoom: ChatRoom): Promise<Lesson> {
    const lesson = await this.lessonModel.create({
      id: ulid(),
      createdAt: new Date(),
      user,
      topic: testLesson.topic,
      plan: testLesson.plan,
      settings: testLesson.settings,
      difficulty: testLesson.difficulty,
      problems: testLesson.problems,
      chatRoom,
    });

    return lesson.toObject();
  }

  update(id: string, updatedLesson: UpdateLessonDto) {
    updatedLesson.updatedAt = new Date();
    return this.lessonModel.updateOne({ id }, updatedLesson);
  }

  async setSolvingProblem(lesson: Lesson, problemId: string) {
    let updated = false;
    lesson.problems = lesson.problems.map((problem) => {
      if (!problem.startedSolvingAt && problem.id === problemId) {
        problem.startedSolvingAt = new Date();
        updated = true;
      }
      return problem;
    });

    if (updated) await this.update(lesson.id, lesson);
  }

  static findUnsolvedProblem(lesson: Lesson) {
    return lesson.problems.find((p) => p.solutionStatus == 'unsolved');
  }
}
