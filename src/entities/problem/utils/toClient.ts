import { ClientProblem } from '../interfaces/clientProblem.interface';
import { Problem } from '../schemas/problem.schema';

export const toClient = (problem: Problem | null): ClientProblem | null => {
  if (!problem) return problem;

  return {
    ...problem,
    solution: {
      options: problem.solution.options.map(({ id, description, extra }) => ({
        id,
        description,
        extra,
      })),
    },
  };
};
