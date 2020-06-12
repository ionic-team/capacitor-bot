import * as core from '@actions/core';
import * as github from '@actions/github';
import processIssueOpened from './events/issues/opened';

const run = async (): Promise<void> => {
  const {
    eventName,
    payload: { action },
  } = github.context;

  const repoToken = core.getInput('repo-token', { required: true });

  core.info(`Received event: ${eventName}/${action}`);

  try {
    if (eventName === 'issues' && action === 'opened') {
      await processIssueOpened(repoToken);
    } else {
      core.warning(`No handler for ${eventName}`);
    }
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
};

run();
