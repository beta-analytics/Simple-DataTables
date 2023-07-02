import { test, expect } from '@playwright/test'
import testConfigs from './testconfigs'
import { defaultConfig } from '../../table/src/config'

// function to locate elements dynamically using locator method
let page
let useables = {}
async function locateElement(root, selector, name = null) {
    if (null == name) {
        return root.locator(selector)
    }
    useables[name] = root.locator(selector)
    return useables[name]
}

test.describe('match config with UI', async () => {
    // test.describe.configure({ mode: 'serial' });

    test.beforeAll(async ({ browser }) => {
        let context = await browser.newContext()
        page = await context.newPage()
    })

    test.beforeEach(async () => {
        await page.goto(testConfigs.url)
    })

    test.afterAll(async ({ browser }) => {
        browser.close()
    })

    test('are headers being displayed', async () => {
        let headers = await locateElement(page, '#table thead')
        if (defaultConfig.header) {
            await expect(headers).toBeAttached()
        } else {
            await expect(headers).not.toBeAttached()
        }
    })

    test('is searchbar present when searchale is true and placeholder is correct', async function () {
        let searchBar = await locateElement(page, '.dataTable-input')
        if (defaultConfig.searchable) {
            await expect(searchBar).toBeAttached() // assert whether the element is visible
            await expect(await (searchBar.getAttribute('placeholder'))).toEqual(defaultConfig.labels.placeholder) // to assert the placeholder
        } else {
            await expect(searchBar).not.toBeAttached() // assert the input is not in existence
        }
    })

    test('is info text correct', async () => {
        let infoLabel = await locateElement(page, '.dataTable-info')
        let tr = await page.$$('#table tbody tr')
        await expect(await (infoLabel.textContent())).toEqual(`Showing 1 to ${tr.length} of 30 entries`)
    })

    test('No entries found', async () => {
        let searchBar = await locateElement(page, '.dataTable-input')
        await searchBar.fill('jfejfkl') // Intentionally wrong value so that the search breaks
        await searchBar.press('Enter')
        let emptyTable = await locateElement(page, '.dataTables-empty')
        await expect(await (emptyTable.textContent())).toEqual(defaultConfig.labels.noRows)
    })

    test('is initial rows equal to perpage', async () => {
        let tr = await page.$$('#table tbody tr')
        await expect(await (tr.length)).toEqual(defaultConfig.perPage)
    })

    test('table top bar is only rendering when layout is present', async () => {
        await locateElement(page, '.dataTable-top', 'topbar')
        if (!defaultConfig.layout) {
            await expect(useables.topbar).not.toBeAttached()
        } else {
            await expect(useables.topbar).toBeAttached()
        }
    })

    test('table top bar is only rendering when layout.top is non empty', async () => {
        await locateElement(page, '.dataTable-top', 'topbar')
        if (defaultConfig.layout) {
            if ('' !== defaultConfig.layout.top) {
                await expect(useables.topbar).toBeAttached()
            } else {
                await expect(useables.topbar).not.toBeAttached()
            }
        }
    })

    test('table bottom bar is only rendering when layout is present', async () => {
        await locateElement(page, '.dataTable-bottom', 'bottombar')
        if (!defaultConfig.layout) {
            await expect(useables.bottombar).not.toBeAttached()
        } else {
            await expect(useables.bottombar).toBeAttached()
        }
    })

    test('table bottom bar is only rendering when layout.bottom is non empty', async () => {
        await locateElement(page, '.dataTable-bottom', 'bottombar')

        if (defaultConfig.layout) {
            if ('' !== defaultConfig.layout.bottom) {
                await expect(useables.bottombar).toBeAttached()
            } else {
                await expect(useables.bottombar).not.toBeAttached()
            }
        }
    })


    test('table top bar is rendering correct child element as passed with options', async () => {
        await locateElement(page, '.dataTable-top', 'topbar')

        if (defaultConfig.layout && '' !== defaultConfig.layout.top) {
            let topLayout = defaultConfig.layout.top
            let topLayoutArr = topLayout.replaceAll('}{', ' ').replace(/{|}/g, '').split(' ')
            for (let i = 0; i < topLayoutArr.length; i++) {
                await expect(await locateElement(useables.topbar, `[data-testid = ${topLayoutArr[i]}]`)).toBeAttached()
            }
        }
    })

    test('table bottom bar is rendering correct child elements as passed with options', async () => {
        await locateElement(page, '.dataTable-bottom', 'bottombar')

        if (defaultConfig.layout) {
            let bottomLayout = defaultConfig.layout.bottom
            let bottomLayoutArr = bottomLayout.replaceAll('}{', ' ').replace(/{|}/g, '').split(' ')
            for (let i = 0; i < bottomLayoutArr.length; i++) {
                await expect(await locateElement(useables.bottombar, `[data-testid = ${bottomLayoutArr[i]}]`)).toBeAttached()
            }
        }
    })

    test('testing useables', async () => {
        console.log(useables)
        await expect(useables.topbar).not.toBeAttached()
    })

})
