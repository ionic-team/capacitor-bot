import * as core from '@actions/core';
import * as github from '@actions/github';

import type { GitHubClient } from '../client';
import type { Task } from '../config';

export interface AddCommentConfig {
  comment: string;
}

export type AddCommentTask = Task<'add-comment', AddCommentConfig>;

const run = async (client: GitHubClient, { comment }: AddCommentConfig) => {
  await client.issues.createComment({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.issue.number,
    body: comment,
  });

  core.info(`added comment to issue #${github.context.issue.number}`);
};

export default run;
