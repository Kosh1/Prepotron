import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Problem } from './schemas/problem.schema';
import { Model } from 'mongoose';
import { problems } from './config/problems';
import { AnswerCheck } from './interfaces/answerCheck.interface';
import { UserWrongAnswer } from '../../prompt/interfaces/prompt.interface';
import { getAnswerTextFromProblem, getDescriptionTextFromProblem } from './utils/getAnswerFromProblem';

@Injectable()
export class ProblemService {
  constructor(@InjectModel(Problem.name) private readonly problemModel: Model<Problem>) {}

  async getProblem(id: string): Promise<Problem> {
    const result = problems.find((problem) => problem.id === id);
    // const result = await this.problemModel.findOne({ id }).exec();
    if (!result) {
      throw new Error(`Problem with id ${id} not found`);
    }

    return Promise.resolve(result);
  }

  async getRandomProblem(): Promise<Problem> {
    const randomIndex = Math.floor(Math.random() * problems.length);
    const result = problems[randomIndex];

    return Promise.resolve(result);
  }

  async compareAnswer(userAnswer: string, problemId: string): Promise<AnswerCheck> {
    const problem = await this.getProblem(problemId);
    // TODO: rework for multiple choice
    const isCorrect = problem.solution.correctOptions[0] === userAnswer;

    return { isCorrect };
  }

  async getExplanationRequest(userAnswer: string, problemId: string): Promise<UserWrongAnswer> {
    const problem = await this.getProblem(problemId);
    const pickedOption = problem.solution.options.find((opt) => opt.id === userAnswer);
    if (!pickedOption) {
      throw new BadRequestException('Could not find the matching answer option');
    }
    const answerHint = pickedOption.explanation;

    return {
      explanation: answerHint,
      userAnswer: getAnswerTextFromProblem(problem, userAnswer),
      description: getDescriptionTextFromProblem(problem),
    };
  }
}
