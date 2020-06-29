import * as core from '@actions/core';
import * as github from '@actions/github';

import type { GitHubClient } from '../client';
import type { Task } from '../config';

export interface CommentOnLabelConfig {
  labels: {
    name: string;
    comment?: string;
    close?: boolean;
    lock?: boolean;
  }[];
}

export type CommentOnLabelTask = Task<'comment-on-label', CommentOnLabelConfig>;

const run = async (client: GitHubClient, { labels }: CommentOnLabelConfig) => {
  const { label } = github.context.payload;

  if (!label) {
    core.warning('no label in event payload');
    return;
  }

  for (const labelConfig of labels) {
    if (labelConfig.name === label.name) {
      if (labelConfig.comment) {
        await client.issues.createComment({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          issue_number: github.context.issue.number,
          body: labelConfig.comment,
        });

        core.info(`added comment to issue #${github.context.issue.number}`);
      }

      if (labelConfig.close) {
        await client.issues.update({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          issue_number: github.context.issue.number,
          state: 'closed',
        });

        core.info(`closed issue #${github.context.issue.number}`);
      }

      if (labelConfig.lock) {
        await client.issues.lock({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          issue_number: github.context.issue.number,
        });

        core.info(`locked issue #${github.context.issue.number}`);
      }
    }
  }
};

export default run;
