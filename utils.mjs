/**
 * 
 * @param {WebdriverIO.Browser} driver 
 * @param {string} buttonFinder 
 * @param {Vi.ExpectStatic} expect 
 */
export const validateElementPosition = async (driver, buttonFinder, expect) => {
    const bottomLeft = await driver.execute(
      'flutter:getBottomLeft',
      buttonFinder
    );
    expect(typeof bottomLeft.dx).toEqual('number');
    expect(typeof bottomLeft.dy).toEqual('number');
  
    const bottomRight = await driver.execute(
      'flutter:getBottomRight',
      buttonFinder
    );
    expect(typeof bottomRight.dx).toEqual('number');
    expect(typeof bottomRight.dy).toEqual('number');
  
    const center = await driver.execute('flutter:getCenter', buttonFinder);
    expect(typeof center.dx).toEqual('number');
    expect(typeof center.dy).toEqual('number');
  
    const topLeft = await driver.execute('flutter:getTopLeft', buttonFinder);
    expect(typeof topLeft.dx).toEqual('number');
    expect(typeof topLeft.dy).toEqual('number');
  
    const topRight = await driver.execute('flutter:getTopRight', buttonFinder);
    expect(typeof topRight.dx).toEqual('number');
    expect(typeof topRight.dy).toEqual('number');
  };