import { createFilterByPatterns, replaceRange } from '../str';

describe('utils/str', () => {
  describe('createFilterByPatterns', () => {
    const patterns = [new RegExp('^0$'), new RegExp('^a.*z$')];

    it('should filter a...z by pattern', () => {
      const str = 'abcdefghijklmnopqrstuvwxyz';
      const filter = createFilterByPatterns(patterns);

      expect(filter(str)).toEqual(true);
    });

    it('should filter 0 by pattern', () => {
      const str = '0';
      const filter = createFilterByPatterns(patterns);

      expect(filter(str)).toEqual(true);
    });

    it('should not filter 1 by pattern', () => {
      const str = '1';
      const filter = createFilterByPatterns(patterns);

      expect(filter(str)).toEqual(false);
    });
  });

  describe('replaceRange', () => {
    it('should replace a range of text', () => {
      const str = 'a\n<here>\nc';
      const expected = 'a\nb\nc';
      const result = replaceRange(str, 2, 8, 'b');

      expect(result).toEqual(expected);
    });
  });
});
