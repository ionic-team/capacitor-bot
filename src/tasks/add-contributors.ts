import * as core from '@actions/core';
import * as github from '@actions/github';
import * as exec from '@actions/exec';
import { readFile, writeFile } from 'fs-extra';
import difference from 'lodash/difference';

import type { GitHubClient } from '../client';
import type { Task } from '../config';
import {
  findSectionByLooseTitle,
  parseMarkdownIntoSections,
} from '../utils/markdown';
import { parseContributors, generateContributors } from '../utils/contributors';
import { replaceRange } from '../utils/str';

export interface AddContributorsConfig {
  base?: string;
  file?: string;
}

export type AddContributorsTask = Task<
  'add-contributors',
  AddContributorsConfig
>;

const run = async (
  client: GitHubClient,
  { base = 'master', file = 'README.md' }: AddContributorsConfig,
) => {
  if (github.context.ref !== `refs/heads/${base}`) {
    core.info(`not processing for ref: ${github.context.ref}`);
    return;
  }

  const { commits } = github.context.payload;
  core.info(
    `processing commits: ${commits.map((commit: any) => commit.id).join(', ')}`,
  );

  const authors = commits
    .map((commit: any) => commit.author)
    .filter((author: any) => !author.username.endsWith('[bot]'));

  if (authors.length === 0) {
    core.warning(`no human authors found for commits!`);
    return;
  }

  const authorUsernames = authors.map((author: any) => author.username);

  core.info(`authors: ${authorUsernames.join(', ')}`);

  const contents = await readFile(file, 'utf8');
  const { sections } = parseMarkdownIntoSections(contents);
  const section = findSectionByLooseTitle(sections, 'contributors');

  if (!section) {
    core.warning(`no contributors section in ${file}`);
    return;
  }

  const startIndex = section.nodes.findIndex(
    n => n.type === 'html' && n.value === '<!-- CONTRIBUTORS:START -->',
  );

  if (startIndex === -1) {
    core.warning('no contributors:start tag!');
    return;
  }

  const htmlNode = section.nodes[startIndex + 1];
  const contributors = parseContributors(htmlNode.value);

  core.info(
    `current contributors: ${
      contributors.length > 0 ? contributors.join(', ') : 'none!'
    }`,
  );

  const newContributors = difference(authorUsernames, contributors);

  core.info(
    `new contributors: ${
      newContributors.length > 0 ? newContributors.join(', ') : 'none!'
    }`,
  );

  if (newContributors.length == 0) {
    return;
  }

  const branch = `new-contributors-${newContributors.join('-')}`;
  let output = '';

  await exec.exec('git', ['ls-remote', '--heads', 'origin', branch], {
    listeners: { stdout: data => (output += data.toString()) },
  });

  if (output.trim()) {
    core.warning(`branch ${branch} already exists on remote!`);
    return;
  }

  const allContributors = [...newContributors, ...contributors];

  const {
    start: { offset: startOffset },
    end: { offset: endOffset },
  } = htmlNode.position;

  const newContents = replaceRange(
    contents,
    startOffset,
    endOffset,
    generateContributors(allContributors),
  );

  const message = `add new contributor${
    newContributors.length === 1 ? '' : 's'
  } to ${file}`;

  await writeFile(file, newContents);
  await exec.exec('git', ['checkout', '-b', branch]);
  await exec.exec('git', ['add', file]);
  await exec.exec('git', ['commit', '-m', message]);
  await exec.exec('git', ['push', 'origin', branch]);

  await client.pulls.create({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    title: 'New contributors! 💖',
    body: `
It looks like there are new contributors in the \`${base}\` branch!

I've added the following wonderful people to \`${file}\`:
* ${newContributors.join('\n* ')}

Have a great day!
Ionitron 💙
`.trim(),
    head: branch,
    base,
  });
};

export default run;
