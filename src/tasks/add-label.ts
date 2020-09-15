import * as core from '@actions/core';
import * as github from '@actions/github';

import type { GitHubClient } from '../client';
import type { Task } from '../config';

export interface AddLabelConfig {
  readonly label: string;
}

export type AddLabelTask = Task<'add-label', AddLabelConfig>;

const run = async (
  client: GitHubClient,
  { label }: AddLabelConfig,
): Promise<void> => {
  await client.issues.addLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.issue.number,
    labels: [label],
  });

  core.info(`added ${label} label to issue #${github.context.issue.number}`);
};

export default run;
