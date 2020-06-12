import { replaceRange } from '../str';

describe('utils/str', () => {
  describe('replaceRange', () => {
    it('should replace a range of text', () => {
      const str = 'a\n<here>\nc';
      const expected = 'a\nb\nc';
      const result = replaceRange(str, 2, 8, 'b');

      expect(result).toEqual(expected);
    });
  });
});
