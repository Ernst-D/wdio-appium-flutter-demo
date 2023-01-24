// import * as wdio from 'webdriverio';
// import * as assert from 'assert';
import { remote } from 'webdriverio';
import { strictEqual } from 'assert';
import { byValueKey, byTooltip, descendant, byType, byText, pageBack, ancestor, bySemanticsLabel } from 'appium-flutter-finder';

const osSpecificOps =
  process.env.APPIUM_OS === 'android'
    ? {
        'appium:platformName': 'Android',
        'appium:deviceName': 'Pixel 4',
        "appium:platformVersion": "13",
        // @todo support non-unix style path
        'appium:app': "/Users/ernst/Documents/prog/appium-flutter/app-debug.apk" // download local to run faster and save bandwith
        // app: 'https://github.com/truongsinh/appium-flutter-driver/releases/download/v0.0.4/android-real-debug.apk',
      }
    : process.env.APPIUM_OS === 'ios'
    ? {
        'appium:platformName': 'iOS',
        'appium:platformVersion': '15.5',
        'appium:deviceName': 'iPhone 13',
        'appium:connectionRetryTimeout': 60000,
        'appium:noReset': true,
        'appium:app': __dirname + '/../../apps/ios-sim-debug.zip' // download local to run faster and save bandwith
        // app: 'https://github.com/truongsinh/appium-flutter-driver/releases/download/v0.0.4/ios-sim-debug.zip',
      }
    : {};

const opts = {
  port: 4723,
  path: '/wd/hub',
  capabilities: {
    'appium:automationName': 'Flutter',
    ...osSpecificOps,
  }
};

const counterTextFinder = byValueKey('counter');
const buttonFinder = byValueKey('increment');

const driver = await remote(opts);

await validateElementPosition(driver, buttonFinder);

strictEqual(await driver.execute('flutter:checkHealth'), 'ok');
await driver.execute('flutter:clearTimeline');
await driver.execute('flutter:forceGC');

const renderObjectDiagnostics = await driver.execute(
  'flutter:getRenderObjectDiagnostics',
  counterTextFinder,
  { includeProperties: true, subtreeDepth: 2 }
);
strictEqual(renderObjectDiagnostics.type, 'DiagnosticableTreeNode');
strictEqual(renderObjectDiagnostics.children.length, 1);

const semanticsId = await driver.execute(
  'flutter:getSemanticsId',
  counterTextFinder
);
strictEqual(semanticsId, 4);

const treeString = await driver.execute('flutter: getRenderTree');
strictEqual(treeString.substr(0, 11), 'RenderView#');

await driver.switchContext('NATIVE_APP');
await driver.saveScreenshot('./native-screenshot.png');
await driver.switchContext('FLUTTER');
await driver.saveScreenshot('./flutter-screenshot.png');

/* new example
if (process.env.APPIUM_OS === 'android') {
  await driver.switchContext('NATIVE_APP');
  await (await driver.$('~fab')).click();
  await driver.switchContext('FLUTTER');
} else {
  console.log(
    'Switching context to `NATIVE_APP` is currently only applicable to Android demo app.'
  );
}
*/

strictEqual(await driver.getElementText(counterTextFinder), '0');

//Long Press using flutter command on Increment button, it should visible 'increment' tooltip after longTap
await driver.execute('flutter:longTap', byValueKey('increment'), {durationMilliseconds: 10000, frequency: 30});

//Long Press using TouchAction with wait
await driver.touchAction([
  {
   action: 'longPress',
   element: { elementId: buttonFinder }
  },
  {
   action: 'wait',
   ms: 10000
  },
  {
   action: 'release'
  }
]);

//Long Press using TouchAction without wait
await driver.touchAction([
  {
   action: 'longPress',
   element: { elementId: buttonFinder }
  },
  {
   action: 'release'
  }
]);

//Long Press using TouchAction without wait and release
await driver.touchAction([
  {
   action: 'longPress',
   element: { elementId: buttonFinder }
  },
]);

await driver.saveScreenshot('./flutter-longPress.png');

await driver.elementClick(buttonFinder);
await driver.touchAction({
  action: 'tap',
  element: { elementId: buttonFinder }
});

strictEqual(await driver.getElementText(counterTextFinder), '2');

await driver.elementClick(byTooltip('Increment'));

strictEqual(
  await driver.getElementText(
    descendant({
      of: byTooltip('counter_tooltip'),
      matching: byValueKey('counter')
    })
  ),
  '3'
);

await driver.elementClick(byType('FlatButton'));

let firstWaitForAbsentError;
try {
  await driver.execute('flutter:waitForAbsent', buttonFinder, {durationMilliseconds: 1});
} catch(e) {
  firstWaitForAbsentError = e;
} finally {
  // @todo
}

try {
  await driver.execute('flutter:waitForAbsent', buttonFinder, {durationMilliseconds: 'malformed input'});
} catch(e) {
  firstWaitForAbsentError = e;
} finally {
  // @todo
}

await driver.execute('flutter:waitForAbsent', buttonFinder);

strictEqual(
  await driver.getElementText(byText('This is 2nd route')),
  'This is 2nd route'
);

await driver.execute('flutter:scrollUntilVisible', byType('ListView'), {item:byType('TextField'), dxScroll: 90, dyScroll: -400});
await driver.execute('flutter:scroll', byType('ListView'), {dx: 50, dy: 100, durationMilliseconds: 200, frequency: 30});
await driver.execute('flutter:scrollIntoView', byType('TextField'), {alignment: 0.1});
await driver.elementSendKeys(byType('TextField'), 'I can enter text');
await driver.execute('flutter:waitFor', byText('I can enter text')); // verify text appears on UI
await driver.elementClear(byType('TextField')); //It can Clear the text field

await driver.elementClick(pageBack());
await driver.execute(
  'flutter:waitFor',
  buttonFinder
);

strictEqual(
  await driver.getElementText(
    descendant({
      of: ancestor({
        of: bySemanticsLabel(RegExp('counter_semantic')),
        matching: byType('Tooltip')
      }),
      matching: byType('Text')
    })
  ),
  '3'
);

await driver.deleteSession();

const validateElementPosition = async (driver, buttonFinder) => {
  const bottomLeft = await driver.execute(
    'flutter:getBottomLeft',
    buttonFinder
  );
  strictEqual(typeof bottomLeft.dx, 'number');
  strictEqual(typeof bottomLeft.dy, 'number');

  const bottomRight = await driver.execute(
    'flutter:getBottomRight',
    buttonFinder
  );
  strictEqual(typeof bottomRight.dx, 'number');
  strictEqual(typeof bottomRight.dy, 'number');

  const center = await driver.execute('flutter:getCenter', buttonFinder);
  strictEqual(typeof center.dx, 'number');
  strictEqual(typeof center.dy, 'number');

  const topLeft = await driver.execute('flutter:getTopLeft', buttonFinder);
  strictEqual(typeof topLeft.dx, 'number');
  strictEqual(typeof topLeft.dy, 'number');

  const topRight = await driver.execute('flutter:getTopRight', buttonFinder);
  strictEqual(typeof topRight.dx, 'number');
  strictEqual(typeof topRight.dy, 'number');
};