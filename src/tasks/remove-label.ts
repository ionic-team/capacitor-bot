import * as core from '@actions/core';
import * as github from '@actions/github';
import sortBy from 'lodash/fp/sortBy';

import type { GitHubClient, GitHubEndpoints } from '../client';
import type { Task } from '../config';

export interface RemoveLabelConfig {
  label: string;
  'exclude-labeler'?: boolean;
}

export type RemoveLabelTask = Task<'remove-label', RemoveLabelConfig>;

const run = async (
  client: GitHubClient,
  { label, 'exclude-labeler': excludeLabeler = true }: RemoveLabelConfig,
): Promise<void> => {
  try {
    if (excludeLabeler) {
      let page = 1;
      const data: GitHubEndpoints['issues']['listEventsForTimeline']['response']['data'] = [];

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
        (event: any) => event.event === 'labeled' && event.label.name === label,
      );

      if (!lastLabel) {
        core.warning(
          `${label} label did not appear in timeline for issue #${github.context.issue.number}`,
        );
        return;
      }

      if (lastLabel.actor.login === github.context.actor) {
        core.info(
          `not removing ${label} label for action by user who added it`,
        );
        return;
      }
    }

    await client.issues.removeLabel({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.issue.number,
      name: label,
    });

    core.info(
      `removed ${label} label from issue #${github.context.issue.number}`,
    );
  } catch (e) {
    core.warning(e.message);
  }
};

export default run;
