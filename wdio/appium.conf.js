import { _androidCaps, _iosCaps } from "../shared/capabilities.mjs";
import { config } from "./wdio.conf";

config.port = 4723;
config.maxInstances = 2;
config.services = [[
    'appium', {
    // Appium service options here
    // ...
    }]
]
config.capabilities = [
    {
        "appium:automationName": "Flutter",
        ..._androidCaps
    },
    {
        "appium:automationName": "Flutter",
        ..._iosCaps
    }
]

exports.config = config