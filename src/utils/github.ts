import * as core from '@actions/core';
import * as github from '@actions/github';

import type { GitHubClient } from '../client';

export interface CreateCommentOptions {
  readonly comment?: string;
  readonly close?: boolean;
  readonly lock?: boolean;
}

export const createComment = async (
  client: GitHubClient,
  options: CreateCommentOptions,
): Promise<void> => {
  if (options.comment) {
    await client.issues.createComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.issue.number,
      body: options.comment,
    });

    core.info(`added comment to issue #${github.context.issue.number}`);
  }

  if (options.close) {
    await client.issues.update({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.issue.number,
      state: 'closed',
    });

    core.info(`closed issue #${github.context.issue.number}`);
  }

  if (options.lock) {
    await client.issues.lock({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.issue.number,
    });

    core.info(`locked issue #${github.context.issue.number}`);
  }
};

export const getTeamMembers = async (
  client: GitHubClient,
  teamSlug: string,
): Promise<string[]> => {
  const org = github.context.repo.owner;
  const response = await client.request(
    '/orgs/{org}/teams/{teamSlug}/members',
    {
      org,
      teamSlug,
    },
  );

  return response.data.map((member: any) => member.login);
};
