const { byValueKey } = require("appium-flutter-finder");
const { validateElementPosition } = require("../../vitest/utils.mjs");

describe('My Login application', () => {
    it('should login with valid credentials', async () => {
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
})