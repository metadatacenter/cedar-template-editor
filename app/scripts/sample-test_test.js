// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('sample test', function () {
  it('has a dummy spec to test 2 + 2', function () {
    // An intentionally failing test. No code within expect() will never equal 4.
    expect(2 + 2).toEqual(4);
  });
});