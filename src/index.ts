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

  core.info(`Received event: ${eventName}/${action}`);

  try {
    if (eventName === 'push') {
      await processPush(repoToken);
    } else if (eventName === 'issues' && action === 'opened') {
      await processIssueOpened(repoToken);
    } else if (eventName === 'issue_comment' && action === 'created') {
      await processIssueCommentCreated(repoToken);
    } else {
      core.warning(`no handler for ${eventName}/${action}`);
    }
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
};

run();
