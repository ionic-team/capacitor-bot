import * as core from '@actions/core';
import * as github from '@actions/github';

import type { GitHubClient } from '../client';
import type { Task } from '../config';

export interface AssignToProjectConfig {
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
    'column-id': columnId,
    'only-members-of-team-slug': onlyMembersOfTeamSlug,
  }: AssignToProjectConfig,
): Promise<void> => {
  if (onlyMembersOfTeamSlug) {
    const org = github.context.repo.owner;
    const login = (github.context.payload.issue as any).user.login;
    const teamMembers = await client.request(
      '/orgs/{org}/teams/{teamSlug}/members',
      {
        org,
        teamSlug: onlyMembersOfTeamSlug,
      },
    );
    const isMemberInTeam = teamMembers.data.some(
      (x: any) => x.login === login,
    );

    if (!isMemberInTeam) {
      core.info(`User ${login} was not in the team, issue was not added to project column ${columnId}`)
      return;
    }
  }

  await client.projects.createCard({
    column_id: columnId,
    content_type: 'Issue',
    content_id: (github.context.payload.issue as any).id,
  });

  core.info(
    `added issue #${github.context.issue.number} to project column ${columnId}`,
  );
};

export default run;
