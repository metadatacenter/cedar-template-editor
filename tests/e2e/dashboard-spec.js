describe('dashboard', function() {
  it('should have a title', function() {
    browser.get('https://cedar.metadatacenter.orgx');

    expect(browser.getTitle()).toEqual('Project Cedar');
  });
});
