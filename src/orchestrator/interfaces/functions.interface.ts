export const ExposedFunctionName = {
  getLesson: 'getLesson',
  getProblem: 'getProblem',
} as const;

type ExposedFunctionNameType = typeof ExposedFunctionName;

export const isExposedFunctionName = (name?: string): name is keyof ExposedFunctionNameType => {
  return Object.values(ExposedFunctionName).includes(name as keyof ExposedFunctionNameType);
};
