import * as core from '@actions/core';
import * as github from '@actions/github';

const run = async (repoToken: string) => {
  const client = github.getOctokit(repoToken);

  await client.issues.removeLabel({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.issue.number,
    name: 'needs-reply',
  });

  core.info(
    `removed needs-reply label from issue #${github.context.issue.number}`,
  );
};

export default run;
