export const isNMinutesAgo = (date: Date, minutes: number) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return diff > minutes * 60 * 1000;
};
