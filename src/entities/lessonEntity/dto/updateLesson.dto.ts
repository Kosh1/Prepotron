import { TaskProblem } from '../schemas/lesson.schema';

export class UpdateLessonDto {
  readonly problems: Array<TaskProblem>;
  updatedAt?: Date;
}
