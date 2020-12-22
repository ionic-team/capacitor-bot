import * as core from '@actions/core';
import * as github from '@actions/github';

import type { GitHubClient } from '../client';
import type { Task } from '../config';

export interface AssignToProjectConfig {
  readonly label: string;
  readonly 'column-id': number;
  readonly 'only-members-of-team-slug'?: string;
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
    'only-members-of-team-slug': onlyMembersOfTeamSlug,
  }: AssignToProjectConfig,
): Promise<void> => {
  if (onlyMembersOfTeamSlug) {
    const org = github.context.repo.owner;
    const teamMembers = await client.request(
      '/orgs/{org}/teams/{teamSlug}/members',
      {
        org,
        teamSlug: onlyMembersOfTeamSlug,
      },
    );
    const isMemberInTeam = teamMembers.data.any(
      (x: any) => x.login === (github.context.payload.issue as any).user.login,
    );

    if (isMemberInTeam) {
      await client.projects.createCard({
        column_id: columnId,
        content_type: 'Issue',
        content_id: (github.context.payload.issue as any).id,
      });
    }
  } else {
    await client.projects.createCard({
      column_id: columnId,
      content_type: 'Issue',
      content_id: (github.context.payload.issue as any).id,
    });
  }

  core.info(`added ${label} label to issue #${github.context.issue.number}`);
};

export default run;
