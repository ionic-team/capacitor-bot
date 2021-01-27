import * as core from '@actions/core';
import * as github from '@actions/github';

import { getClient } from './client';
import { getConfig } from './config';
import { runTask, createTriggeredBy } from './tasks';
import { getTeamMembers } from './utils/github';
import { evaluateCondition } from './vm';

const run = async (): Promise<void> => {
  try {
    const { eventName, payload } = github.context;
    const { action } = payload;

    const event = `${eventName}${action ? ` (type: ${action})` : ''}`;
    core.info(`triggered by: ${event}`);

    const repoToken = core.getInput('repo-token');
    const configPath = core.getInput('config-path', { required: true });

    if (!repoToken) {
      core.warning(`no repo-token input provided--skipping tasks`);
      return;
    }

    const client = getClient(repoToken);
    const config = await getConfig(client, configPath);
    core.info(`using config from ${configPath}`);

    const triggeredBy = createTriggeredBy(eventName, action);
    const tasks = config.tasks.filter(triggeredBy);

    if (tasks.length === 0) {
      core.warning(`no tasks configured for ${event}`);
      return;
    }

    for (const task of tasks) {
      if (
        !task.condition ||
        (await evaluateCondition(task.condition, {
          payload,
          config: task.config,
          getTeamMembers: (teamSlug: string) =>
            getTeamMembers(client, teamSlug),
        }))
      ) {
        core.info(`running ${task.name} task for ${event} event`);
        await runTask(client, task);
      }
    }
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
};

run();
