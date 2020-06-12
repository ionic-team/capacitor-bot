import * as core from '@actions/core';
import intersection from 'lodash/fp/intersection';

import { Node, parseMarkdown } from './markdown';

export interface ParsedIssue {
  sections: IssueSection[];
}

export interface IssueSection {
  title: string;
  nodes: Node[];
}

export const parseIssue = (body: string): ParsedIssue => {
  const nodes = parseMarkdown(body);
  const sections: IssueSection[] = [];

  for (const node of nodes) {
    if (node.type === 'heading') {
      sections.push({
        title: node.children[0].value,
        nodes: getSectionNodes(node, nodes),
      });
    }
  }

  return { sections };
};

export const getPlatforms = (nodes: Node[]): Platform[] => {
  const platforms: Platform[] = [];

  for (const node of nodes) {
    try {
      if (node.type === 'list') {
        const textEntries: string[] = node.children.map((n: Node) =>
          n.children[0].children[0].value.trim().toLowerCase(),
        );

        platforms.push(...(intersection(PLATFORMS, textEntries) as Platform[]));
      } else if (node.type === 'paragraph') {
        const text = node.children[0].value.toLowerCase();

        for (const platform of PLATFORMS) {
          if (text.includes(platform)) {
            platforms.push(platform);
          }
        }
      }
    } catch (e) {
      core.debug(e.message);
    }
  }

  return platforms;
};

export const findSectionByLooseTitle = (
  sections: IssueSection[],
  title: string,
): IssueSection | undefined => {
  return sections.find(section =>
    section.title.toLowerCase().includes(title.toLowerCase()),
  );
};

export const getSectionNodes = (header: Node, nodes: Node[]): Node[] => {
  const section: Node[] = [header];
  const idx = nodes.indexOf(header);

  for (let i = idx + 1; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.type === 'heading') {
      break;
    }

    section.push(node);
  }

  return section;
};

export type Platform = 'android' | 'ios';

export const PLATFORMS: Platform[] = ['android', 'ios'];
