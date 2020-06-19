import { createTriggeredBy } from '../';

describe('tasks', () => {
  describe('createTriggeredBy', () => {
    it('should be triggered from string', () => {
      const triggeredBy = createTriggeredBy('push');
      const task = {
        name: 'foo',
        on: 'push',
        config: undefined,
      };

      expect(triggeredBy(task)).toEqual(true);
    });

    it('should be triggered from string array', () => {
      const triggeredBy = createTriggeredBy('push');
      const task = {
        name: 'foo',
        on: ['push'],
        config: undefined,
      };

      expect(triggeredBy(task)).toEqual(true);
    });

    it('should be triggered from object', () => {
      const triggeredBy = createTriggeredBy('push');
      const task = {
        name: 'foo',
        on: { push: null },
        config: undefined,
      };

      expect(triggeredBy(task)).toEqual(true);
    });

    it('should be triggered from object with types', () => {
      const triggeredBy = createTriggeredBy('release', 'published');
      const task = {
        name: 'foo',
        on: { release: { types: ['published'] } },
        config: undefined,
      };

      expect(triggeredBy(task)).toEqual(true);
    });

    it('should not be triggered from string mismatch', () => {
      const triggeredBy = createTriggeredBy('push');
      const task = {
        name: 'foo',
        on: 'release',
        config: undefined,
      };

      expect(triggeredBy(task)).toEqual(false);
    });

    it('should not be triggered from string array mismatch', () => {
      const triggeredBy = createTriggeredBy('push');
      const task = {
        name: 'foo',
        on: ['release'],
        config: undefined,
      };

      expect(triggeredBy(task)).toEqual(false);
    });

    it('should not be triggered from object mismatch', () => {
      const triggeredBy = createTriggeredBy('release');
      const task = {
        name: 'foo',
        on: { push: null },
        config: undefined,
      };

      expect(triggeredBy(task)).toEqual(false);
    });

    it('should not be triggered from object mismatch with types', () => {
      const triggeredBy = createTriggeredBy('push');
      const task = {
        name: 'foo',
        on: { release: { types: ['published'] } },
        config: undefined,
      };

      expect(triggeredBy(task)).toEqual(false);
    });

    it('should not be triggered from object with types mismatch', () => {
      const triggeredBy = createTriggeredBy('release', 'created');
      const task = {
        name: 'foo',
        on: { release: { types: ['published'] } },
        config: undefined,
      };

      expect(triggeredBy(task)).toEqual(false);
    });
  });
});
