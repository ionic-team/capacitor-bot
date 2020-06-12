import * as core from '@actions/core';
import * as github from '@actions/github';

import processPush from './events/push';
import processIssueOpened from './events/issues/opened';
import processIssueCommentCreated from './events/issue_comment/created';

const run = async (): Promise<void> => {
  const {
    eventName,
    payload: { action },
  } = github.context;

  const repoToken = core.getInput('repo-token', { required: true });
  const event = action ? `${eventName}/${action}` : eventName;

  core.info(`Received event: ${event}`);

  try {
    if (event === 'push') {
      await processPush(repoToken);
    } else if (event === 'issues/opened') {
      await processIssueOpened(repoToken);
    } else if (event === 'issue_comment/created') {
      await processIssueCommentCreated(repoToken);
    } else {
      core.warning(`no handler for ${event}`);
    }
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
};

run();
