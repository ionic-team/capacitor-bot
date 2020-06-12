import { findSectionByLooseTitle, getPlatforms, parseIssue } from '../issues';

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

      const issue = parseIssue(body);
      const expected = ['android', 'ios'];
      const section = findSectionByLooseTitle(issue.sections, 'platform')!;
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

      const issue = parseIssue(body);
      const expected = ['android', 'ios'];
      const section = findSectionByLooseTitle(issue.sections, 'platform')!;
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

      const issue = parseIssue(body);
      const expected = ['android', 'ios'];
      const section = findSectionByLooseTitle(issue.sections, 'platform')!;
      const result = getPlatforms(section.nodes);

      expect(result).toEqual(expected);
    });
  });
});
