// const _androidCaps = {
//   'appium:platformName': 'Android',
//   'appium:deviceName': 'Pixel 4',
//   "appium:platformVersion": "13",
//   // @todo support non-unix style path
//   'appium:app': "./android-real-debug.apk" // download local to run faster and save bandwith
//   // app: 'https://github.com/truongsinh/appium-flutter-driver/releases/download/v0.0.4/android-real-debug.apk',
// }

import { osSpecificOps } from "../shared/capabilities.mjs";

// const _iosCaps = {
//   'appium:platformName': 'iOS',
//   'appium:platformVersion': '16.2',
//   'appium:deviceName': 'iPhone 14 Pro',
//   'appium:connectionRetryTimeout': 70000,
//   'appium:app': "./ios-sim-debug.app" // download local to run faster and save bandwith
//   // app: 'https://github.com/truongsinh/appium-flutter-driver/releases/download/v0.0.4/ios-sim-debug.zip',
// }

// const osSpecificOps =
//   process.env.APPIUM_OS === 'android'
//     ? _androidCaps
//     : process.env.APPIUM_OS === 'ios'
//     ? _iosCaps
//     : _androidCaps;

export default {
  port: 4723,
  path: '/',
  capabilities: {
    'appium:automationName': 'Flutter',
    ...osSpecificOps,
  }
};