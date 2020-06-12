import { generateContributors, parseContributors } from '../contributors';

describe('utils/contributors', () => {
  describe('parseContributors', () => {
    it('should parse single contributor', () => {
      const html = `
<p align="center">
  <a href="https://github.com/dwieeb"><img src="https://github.com/dwieeb.png?size=100" width="50" height="50" /></a>
</p>`;

      const expected = ['dwieeb'];
      const result = parseContributors(html);

      expect(result).toEqual(expected);
    });

    it('should parse multiple contributors', () => {
      const html = `
<p align="center">
  <a href="https://github.com/dwieeb"><img src="https://github.com/dwieeb.png?size=100" width="50" height="50" /></a>
  <a href="https://github.com/foo"><img src="https://github.com/foo.png?size=100" width="50" height="50" /></a>
</p>`;

      const expected = ['dwieeb', 'foo'];
      const result = parseContributors(html);

      expect(result).toEqual(expected);
    });

    it('should not parse contributors from empty paragraph', () => {
      const html = `
<p align="center">
</p>`;

      const expected: string[] = [];
      const result = parseContributors(html);

      expect(result).toEqual(expected);
    });
  });

  describe('generateContributors', () => {
    it('should generate html for a single contributor', () => {
      const expected = `
<p align="center">
  <a href="https://github.com/dwieeb"><img src="https://github.com/dwieeb.png?size=100" width="50" height="50" /></a>
</p>`.trim();

      const result = generateContributors(['dwieeb']);
      expect(result).toEqual(expected);
    });

    it('should generate html for multiple contributors', () => {
      const expected = `
<p align="center">
  <a href="https://github.com/dwieeb"><img src="https://github.com/dwieeb.png?size=100" width="50" height="50" /></a>
  <a href="https://github.com/foo"><img src="https://github.com/foo.png?size=100" width="50" height="50" /></a>
</p>`.trim();

      const result = generateContributors(['dwieeb', 'foo']);
      expect(result).toEqual(expected);
    });
  });
});
