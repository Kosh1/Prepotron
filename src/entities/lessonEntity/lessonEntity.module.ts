import { Module } from '@nestjs/common';
import { LessonEntityService } from './lessonEntity.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonSchema, Lesson } from './schemas/lesson.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Lesson.name,
        schema: LessonSchema,
      },
    ]),
  ],
  providers: [LessonEntityService],
  exports: [LessonEntityService],
})
export class LessonEntityModule {}
