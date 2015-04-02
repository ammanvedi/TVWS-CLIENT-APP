// spec.js
describe('Measure Space', function() {



  it('Graph should not have data initially', function() {
    browser.get('http://localhost/#/map/92');
    browser.driver.manage().window().setSize(1220, 700);
    expect(element(by.css('.graphnodata')).getCssValue("opacity")).toEqual('1');
    expect(element(by.css('.sidebarnodata')).getCssValue("opacity")).toEqual('1');

  });

   it('should be able to revert back to search mode', function() {
var yourOffset = {x:611,y:392};

browser.driver.actions().mouseMove(element(by.css('.container')), yourOffset).mouseDown().mouseMove(element(by.css('.container')),{x:558,y:388}).mouseUp().perform();
browser.driver.sleep(5000);
    expect(element(by.css('.sidebarnodata')).getCssValue("opacity")).toEqual('0');
  });



});