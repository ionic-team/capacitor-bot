import * as core from '@actions/core';
import * as github from '@actions/github';

import type { GitHubClient } from '../client';
import type { Task } from '../config';
import { getPlatforms } from '../utils/issues';
import {
  parseMarkdownIntoSections,
  findSectionByLooseTitle,
} from '../utils/markdown';

export type AddPlatformLabelsConfig = undefined;

export type AddPlatformLabelsTask = Task<
  'add-platform-labels',
  AddPlatformLabelsConfig
>;

const run = async (
  client: GitHubClient,
  config: AddPlatformLabelsConfig,
): Promise<void> => {
  const { issue } = github.context.payload;

  if (!issue || !issue.body) {
    core.warning('no issue body in event payload');
    return;
  }

  const { sections } = parseMarkdownIntoSections(issue.body);
  const section = findSectionByLooseTitle(sections, 'platform');

  if (!section) {
    core.warning('no platform section in issue body');
    return;
  }

  const platforms = getPlatforms(section.nodes);
  const labels = platforms.map(platform => `platform: ${platform}`);

  await client.issues.addLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.issue.number,
    labels,
  });

  core.info(
    `added ${labels.join(', ')} labels to issue #${
      github.context.issue.number
    }`,
  );
};

export default run;
