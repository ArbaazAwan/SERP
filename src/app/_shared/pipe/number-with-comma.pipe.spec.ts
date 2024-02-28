import { NumberWithCommaPipe } from './number-with-comma.pipe';

describe('NumberWithCommaPipe', () => {
  it('create an instance', () => {
    const pipe = new NumberWithCommaPipe();
    expect(pipe).toBeTruthy();
  });
});
