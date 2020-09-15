import * as core from '@actions/core';
import intersection from 'lodash/fp/intersection';

import type { Node } from './markdown';

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

export type Platform = 'android' | 'ios' | 'electron' | 'web';

export const PLATFORMS: Platform[] = ['android', 'ios', 'electron', 'web'];
