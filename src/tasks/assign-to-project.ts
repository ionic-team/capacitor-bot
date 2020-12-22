import * as core from '@actions/core';
import * as github from '@actions/github';

import type { GitHubClient } from '../client';
import type { Task } from '../config';

export interface AssignToProjectConfig {
  readonly label: string;
  readonly 'column-id': number;
  readonly org: string;
  readonly 'team-slug': string;
}

export type AssignToProjectTask = Task<
  'assign-to-project',
  AssignToProjectConfig
>;

const run = async (
  client: GitHubClient,
  {
    label,
    'column-id': columnId,
    org,
    'team-slug': teamSlug,
  }: AssignToProjectConfig,
): Promise<void> => {
  const teamMembers = await client.request(
    '/orgs/{org}/teams/{teamSlug}/members',
    {
      org,
      teamSlug,
    },
  );
  console.log({org, teamSlug})
  console.log(teamMembers.data);
  await client.projects.createCard({
    column_id: columnId,
    content_type: 'Issue',
    content_id: (github.context.payload.issue as any).id,
  });

  core.info(`added ${label} label to issue #${github.context.issue.number}`);
};

export default run;
