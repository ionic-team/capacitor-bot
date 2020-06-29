import type { GitHubClient } from '../client';
import type { AnyTask, Task } from '../config';

import removeLabel from './remove-label';
import addPlatformLabels from './add-platform-labels';
import addContributors from './add-contributors';
import commentOnLabel from './comment-on-label';

export const runTask = async (
  client: GitHubClient,
  task: AnyTask,
): Promise<void> => {
  switch (task.name) {
    case 'remove-label':
      return removeLabel(client, task.config);
    case 'add-platform-labels':
      return addPlatformLabels(client, task.config);
    case 'add-contributors':
      return addContributors(client, task.config);
    case 'comment-on-label':
      return commentOnLabel(client, task.config);
  }
};

export const createTriggeredBy = (event: string, type?: string) => (
  task: Task<unknown, unknown>,
): boolean => {
  if (typeof task.on === 'string') {
    return task.on === event;
  }

  if (Array.isArray(task.on)) {
    return task.on.some(t => t === event);
  }

  const { [event]: eventConfig } = task.on;

  if (typeof eventConfig === 'undefined') {
    return false;
  }

  if (eventConfig === null) {
    return true;
  }

  if ('types' in eventConfig && eventConfig.types.find(t => t === type)) {
    return true;
  }

  // TODO: branches and tags are not supported yet
  if (event === 'push' || event === 'pull_request') {
    return true;
  }

  return false;
};
