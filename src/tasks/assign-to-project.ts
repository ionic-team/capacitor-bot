import * as core from '@actions/core';
import * as github from '@actions/github';

import type { GitHubClient } from '../client';
import type { Task } from '../config';

export interface AssignToProjectConfig {
  readonly label: string;
  readonly 'column-id': number;
}

export type AssignToProjectTask = Task<'assign-to-project', AssignToProjectConfig>;

const run = async (
  client: GitHubClient,
  { label, "column-id": columnId }: AssignToProjectConfig,
): Promise<void> => {
  await client.projects.createCard({
    column_id: columnId,
    content_id: github.context.issue.number
  })
  console.log(github.context.payload)
  core.info(`added ${label} label to issue #${github.context.issue.number}`);
};

export default run;
