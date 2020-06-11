import * as core from '@actions/core';
import processIssueOpened from './events/issues/opened';

const run = async (): Promise<void> => {
  try {
    await processIssueOpened();
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
};

run();
