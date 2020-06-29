import * as yaml from 'js-yaml';

import { GitHubClient, getFileFromRepo } from './client';
import type { AddLabelTask } from './tasks/add-label';
import type { RemoveLabelTask } from './tasks/remove-label';
import type { AddPlatformLabelsTask } from './tasks/add-platform-labels';
import type { AddContributorsTask } from './tasks/add-contributors';
import type { CommentOnLabelTask } from './tasks/comment-on-label';

export interface TriggerObject {
  readonly [key: string]:
    | {
        readonly types: readonly string[];
      }
    | null
    | undefined;
}

export type Trigger = string | string[] | TriggerObject;

export interface Task<N, C> {
  readonly name: N;
  readonly on: Trigger;
  readonly config: C;
}

export type AnyTask =
  | AddLabelTask
  | RemoveLabelTask
  | AddPlatformLabelsTask
  | AddContributorsTask
  | CommentOnLabelTask;

export interface Config {
  readonly tasks: readonly AnyTask[];
}

export const getConfig = async (
  client: GitHubClient,
  configPath: string,
): Promise<Config> => {
  const contents = await getFileFromRepo(client, configPath);
  const config = yaml.safeLoad(contents);

  // TODO: check config structure

  return config;
};
