import { getPlatforms } from '../issues';
import {
  findSectionByLooseTitle,
  parseMarkdownIntoSections,
} from '../markdown';

describe('utils/issues', () => {
  describe('getPlatforms', () => {
    it('should parse comma-separated from text', () => {
      const body = `
### Platform(s)
<!--
List the platforms that this bug affects.
-->

Android, iOS


### Current Behavior
<!--
Describe how the bug manifests. Be specific.
-->
`;

      const { sections } = parseMarkdownIntoSections(body);
      const expected = ['android', 'ios'];
      const section = findSectionByLooseTitle(sections, 'platform')!;
      const result = getPlatforms(section.nodes);

      expect(result).toEqual(expected);
    });

    it('should parse from text', () => {
      const body = `
### Platform(s)
<!--
List the platforms that this bug affects.
-->

Android
iOS


### Current Behavior
<!--
Describe how the bug manifests. Be specific.
-->
`;

      const { sections } = parseMarkdownIntoSections(body);
      const expected = ['android', 'ios'];
      const section = findSectionByLooseTitle(sections, 'platform')!;
      const result = getPlatforms(section.nodes);

      expect(result).toEqual(expected);
    });

    it('should parse from list', () => {
      const body = `
### Platform(s)
<!--
List the platforms that this bug affects.
-->

* Android
* iOS


### Current Behavior
<!--
Describe how the bug manifests. Be specific.
-->
`;

      const { sections } = parseMarkdownIntoSections(body);
      const expected = ['android', 'ios'];
      const section = findSectionByLooseTitle(sections, 'platform')!;
      const result = getPlatforms(section.nodes);

      expect(result).toEqual(expected);
    });
  });
});
