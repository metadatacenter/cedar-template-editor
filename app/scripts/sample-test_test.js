'use strict';

// a very basic test suite (group of tests)
describe('sample component test', function() {
  // a single test
  it('ensure addition is correct', function() {
    // sample expectation
    expect(1+1).toEqual(2);
  });
  // another test
  it('ensure substraction is correct', function() {
    expect(1-1).toEqual(0);
  });
});
