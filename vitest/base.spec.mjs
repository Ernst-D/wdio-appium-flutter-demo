import { byValueKey } from 'appium-flutter-finder';
import { suite, expect, test, beforeEach, afterEach } from 'vitest'
import { remote } from 'webdriverio';
import opts from './opts.mjs';
import { validateElementPosition } from './utils.mjs';
import fs from "fs/promises";

suite('basic', async () => {
    /**
     * @type {WebdriverIO.Browser}
     */
    let driver;

    beforeEach(async () => {
        driver = await remote(opts);
    })

    afterEach(async () => {
        await driver.deleteSession();
    })

    test('call flutter commands', async () => {
        const counterTextFinder = byValueKey('counter');
        const buttonFinder = byValueKey('increment');

        await validateElementPosition(driver, buttonFinder, expect);

        expect(await driver.execute('flutter:checkHealth')).toStrictEqual('ok');
        await driver.execute('flutter:clearTimeline');
        await driver.execute('flutter:forceGC');

        const renderObjectDiagnostics = await driver.execute('flutter:getRenderObjectDiagnostics',
            counterTextFinder,
            { includeProperties: true, subtreeDepth: 2 }
        );

        expect(renderObjectDiagnostics.type).toStrictEqual('DiagnosticableTreeNode');
        expect(renderObjectDiagnostics.children.length).toStrictEqual(1);

        const semanticsId = await driver.execute(
            'flutter:getSemanticsId',
            counterTextFinder
        );
        expect(semanticsId).toStrictEqual(4);
    })

    test("get render tree", async () => {
        const treeString = await driver.execute('flutter: getRenderTree');
        await fs.writeFile(`./${opts.capabilities['appium:platformName']}-render-tree.txt`, treeString);
        expect(treeString.substr(0, 11)).toStrictEqual('RenderView#');

        await driver.switchContext('NATIVE_APP');
        await driver.saveScreenshot('./native-screenshot.png');
        await driver.switchContext('FLUTTER');
        await driver.saveScreenshot('./flutter-screenshot.png');
    })
})