import type { GitHubClient } from '../client';
import type { Task } from '../config';
import type { CreateCommentOptions } from '../utils/github';
import { createComment } from '../utils/github';

export type AddCommentTask = Task<'add-comment', CreateCommentOptions>;

const run = async (
  client: GitHubClient,
  options: CreateCommentOptions,
): Promise<void> => {
  await createComment(client, options);
};

export default run;
