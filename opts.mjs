const osSpecificOps =
  process.env.APPIUM_OS === 'android'
    ? {
        'appium:platformName': 'Android',
        'appium:deviceName': 'Pixel 4',
        "appium:platformVersion": "13",
        // @todo support non-unix style path
        'appium:app': "./android-real-debug.apk" // download local to run faster and save bandwith
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

export default {
  port: 4723,
  path: '/wd/hub',
  capabilities: {
    'appium:automationName': 'Flutter',
    ...osSpecificOps,
  }
};