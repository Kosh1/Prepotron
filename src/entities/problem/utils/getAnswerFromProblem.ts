import { ProblemExtra } from '../interfaces/problemExtra.interface';
import { Problem } from '../schemas/problem.schema';

export const getAnswerTextFromProblem = (problem: Problem, answerId: string) => {
  const answer = problem.solution.options.find((opt) => opt.id == answerId);
  if (!answer) return answerId;

  return answer.description || extractTextFromExtra(answer.extra);
};

export const getDescriptionTextFromProblem = (problem: Problem) => {
  return problem.description || extractTextFromExtra(problem.extra);
};

const extractTextFromExtra = (extra: ProblemExtra) => {
  if (!extra) return '';

  let textDescription = '';
  if (extra.type === 'chart') {
    textDescription = extra.points.join(';');
  }

  //   if (!textDescription && extra.type === 'figure') {
  //     textDescription = extra.code;
  //   }

  return textDescription;
};
