import { afterAll, beforeAll, suite, expect, test } from 'vitest'

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
        //
        
    })
})