export const replaceRange = (
  str: string,
  start: number,
  end: number,
  replacement: string,
): string => {
  return str.substring(0, start) + replacement + str.substring(end);
};

export const createFilterByPatterns = (regexes: RegExp[]) => (
  s: string,
): boolean => regexes.some(re => re.test(s));
