import * as core from '@actions/core';
import * as github from '@actions/github';

import type { GitHubClient } from '../client';
import type { Task } from '../config';

export interface AssignToProjectColumns {
  readonly issue?: number;
  readonly pr?: number;
  readonly 'draft-pr'?: number;
}

export interface AssignToProjectConfig {
  readonly columns?: AssignToProjectColumns;
}

export type AssignToProjectTask = Task<
  'assign-to-project',
  AssignToProjectConfig
>;

const run = async (
  client: GitHubClient,
  { columns }: AssignToProjectConfig,
): Promise<void> => {
  const columnId = getColumnId(columns);

  if (!columnId) {
    throw new Error('No column ID configured.');
  }

  try {
    await client.projects.createCard({
      column_id: columnId,
      content_type:
        github.context.eventName === 'pull_request' ? 'PullRequest' : 'Issue',
      content_id:
        github.context.payload.pull_request?.id ??
        github.context.payload.issue?.id,
    });
  } catch (e) {
    console.log(e);
    throw e;
  }

  core.info(
    `added issue #${github.context.issue.number} to project column ${columnId}`,
  );
};

const getColumnId = ({
  issue,
  pr,
  'draft-pr': draftPR,
}: AssignToProjectColumns = {}): number | undefined => {
  if (github.context.eventName === 'pull_request') {
    if (github.context.payload.pull_request?.draft) {
      return draftPR;
    } else {
      return pr;
    }
  }

  return issue;
};

export default run;
