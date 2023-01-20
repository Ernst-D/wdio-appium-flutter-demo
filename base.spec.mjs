import { byValueKey } from 'appium-flutter-finder';
import { afterAll, beforeAll, suite, expect, test } from 'vitest'
import { remote } from 'webdriverio';
import opts from './opts.mjs';
import { validateElementPosition } from './utils.mjs';

suite('basic', async () => {
    /**
     * @type {WebdriverIO.Browser}
     */
    let driver;

    beforeAll(async () => {
        driver = await remote(opts);
    })

    afterAll(async () => {
        await driver.deleteSession();
    })

    test('basic flutter test', async () => {
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
        expect(renderObjectDiagnostics.children.length).toStrictEqual(1)
    })
})