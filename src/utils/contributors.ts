import * as core from '@actions/core';

import { isNonNull } from './fn';

export const parseContributors = (html: string): string[] => {
  const str = html.trim();
  const m = /\s*<p.*?>\n[\s\S]*?<\/p>/g.exec(str);

  if (!m) {
    core.warning('contributors html does not match expected pattern!');
    return [];
  }

  const lines = str.split('\n');
  const contributors = lines
    .slice(1, lines.length - 1)
    .map(parseContributor)
    .filter(isNonNull);

  return contributors;
};

const parseContributor = (line: string): string | undefined => {
  const m = /^\s*<a href="https:\/\/github.com\/(?<contributor>[^"]+)"><img.*?\/><\/a>$/g.exec(
    line,
  );

  if (!m) {
    core.warning('line did not match expected pattern!');
    return;
  }

  const contributor = m.groups?.contributor;

  if (!contributor) {
    core.warning('could not parse contributor from line!');
    return;
  }

  return contributor;
};

export const generateContributors = (contributors: string[]): string => {
  const html = contributors.map(generateContributorLine).join('\n');
  return `<p align="center">\n${html}\n</p>`;
};

const generateContributorLine = (contributor: string): string => {
  return `  <a href="https://github.com/${contributor}"><img src="https://github.com/${contributor}.png?size=100" width="50" height="50" /></a>`;
};
