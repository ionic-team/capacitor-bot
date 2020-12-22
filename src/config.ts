import * as yaml from 'js-yaml';

import type { GitHubClient } from './client';
import { getFileFromRepo } from './client';
import type { AddCommentTask } from './tasks/add-comment';
import type { AddCommentForLabelTask } from './tasks/add-comment-for-label';
import type { AddContributorsTask } from './tasks/add-contributors';
import type { AddLabelTask } from './tasks/add-label';
import type { AddPlatformLabelsTask } from './tasks/add-platform-labels';
import type { AssignToProjectTask } from './tasks/assign-to-project';
import type { RemoveLabelTask } from './tasks/remove-label';

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
  readonly condition?: string;
  readonly config: C;
}

export type AnyTask =
  | AddCommentTask
  | AddCommentForLabelTask
  | AddLabelTask
  | RemoveLabelTask
  | AddPlatformLabelsTask
  | AddContributorsTask
  | AssignToProjectTask;

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
