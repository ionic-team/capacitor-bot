import type { GitHubClient } from '../client';
import type { Task } from '../config';
import { CreateCommentOptions, createComment } from '../utils/github';

export type AddCommentTask = Task<'add-comment', CreateCommentOptions>;

const run = async (client: GitHubClient, options: CreateCommentOptions) => {
  await createComment(client, options);
};

export default run;
