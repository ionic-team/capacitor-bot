import * as core from '@actions/core';
import * as github from '@actions/github';

import type { GitHubClient } from '../client';
import type { Task } from '../config';
import type { CreateCommentOptions } from '../utils/github';
import { createComment } from '../utils/github';

export interface AddCommentForLabelConfig extends CreateCommentOptions {
  readonly name: string;
}

export type AddCommentForLabelTask = Task<
  'add-comment-for-label',
  AddCommentForLabelConfig
>;

const run = async (
  client: GitHubClient,
  options: AddCommentForLabelConfig,
): Promise<void> => {
  const { label } = github.context.payload;

  if (!label) {
    core.warning('no label in event payload');
    return;
  }

  if (options.name === label.name) {
    await createComment(client, options);
  }
};

export default run;
