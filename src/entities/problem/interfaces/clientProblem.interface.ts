import { Problem } from '../schemas/problem.schema';
import { AnswerOption } from './answerOption.interface';

export type ClientProblem = Omit<Problem, 'solution'> & {
  solution: {
    options: Array<Omit<AnswerOption, 'explanation'>>;
  };
};
