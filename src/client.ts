import * as github from '@actions/github';
import type { GitHub } from '@actions/github/lib/utils';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
import memoize from 'lodash/fp/memoize';

export type GitHubClient = InstanceType<typeof GitHub>;
export type GitHubEndpoints = RestEndpointMethodTypes;

export const getClient = memoize(
  (repoToken: string): GitHubClient => github.getOctokit(repoToken),
);

export const getFileFromRepo = async (
  client: GitHubClient,
  path: string,
): Promise<string> => {
  try {
    const res = await client.repos.getContent({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      path,
      ref: github.context.sha,
    });

    const { content, encoding } = res.data;

    return Buffer.from(content, encoding as BufferEncoding).toString();
  } catch (e) {
    throw new Error(`error with ${path}: ${e.message}`);
  }
};
