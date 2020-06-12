import * as core from '@actions/core';
import * as github from '@actions/github';

import {
  findSectionByLooseTitle,
  getPlatforms,
  parseIssue,
} from '../../utils/issues';

const run = async (repoToken: string) => {
  const client = github.getOctokit(repoToken);
  const { issue } = github.context.payload;

  if (!issue || !issue.body) {
    core.warning('no issue body in event payload');
    return;
  }

  const { sections } = parseIssue(issue.body);
  const section = findSectionByLooseTitle(sections, 'platform');

  if (!section) {
    core.warning('no platform section in issue body');
    return;
  }

  const platforms = getPlatforms(section.nodes);

  await client.issues.addLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.issue.number,
    labels: platforms,
  });
};

export default run;
