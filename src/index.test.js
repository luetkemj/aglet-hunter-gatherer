import { forage, hunt } from './index';

describe('hunt', () => {
  it('should work', () => {
    expect(hunt('tropical', 'hills', 'spring', 1)).toEqual({});
  });
});

describe('forage', () => {
  it('should work', () => {
    expect(forage('tropical', 'hills', 'spring')).toEqual({});
  });
});
