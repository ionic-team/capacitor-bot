import * as core from '@actions/core';
import * as util from 'util';
import * as vm from 'vm';

export const evaluateCondition = async (
  condition: string,
  context: { [key: string]: any },
): Promise<boolean> => {
  core.info(
    `evaluating condition '${condition}' with context ${util.format(context)}`,
  );

  try {
    vm.createContext(context);
    const container = `(async () => ${condition})()`;
    const result = await vm.runInContext(container, context);
    core.info(`condition '${condition}' ${result ? 'met' : 'unmet'}`);

    return result;
  } catch (e) {
    core.error(e);
  }

  return false;
};
