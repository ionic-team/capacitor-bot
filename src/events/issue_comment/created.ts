import * as core from '@actions/core';
import * as github from '@actions/github';
import sortBy from 'lodash/fp/sortBy';

const run = async (repoToken: string) => {
  const client = github.getOctokit(repoToken);

  try {
    let page = 1;
    const data: any[] = [];

    while (true) {
      const res = await client.issues.listEventsForTimeline({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.issue.number,
        per_page: 100,
        page,
      });

      if (res.data.length === 0) {
        break;
      }

      data.push(...res.data);
      page++;
    }

    // TODO: There doesn't seem to be a way to sort the timeline from the API.
    // Is there a better way?
    const events = sortBy(entry => entry.created_at, data).reverse();

    const lastLabel = events.find(
      event => event.event === 'labeled' && event.label.name === 'needs-reply',
    );

    if (!lastLabel) {
      core.warning(
        `needs-reply label did not appear in timeline for issue #${github.context.issue.number}`,
      );
      return;
    }

    if (lastLabel.actor.login === github.context.payload.comment!.user.login) {
      core.info(`not removing label for comments by user who added it`);
      return;
    }

    await client.issues.removeLabel({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.issue.number,
      name: 'needs-reply',
    });

    core.info(
      `removed needs-reply label from issue #${github.context.issue.number}`,
    );
  } catch (e) {
    core.warning(e.message);
  }
};

export default run;
