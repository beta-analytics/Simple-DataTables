import { test, expect} from '@playwright/test'
import testConfigs from './testconfigs'
import { defaultConfig } from '../../table/src/config'

// function to locate elements dynamically using locator method
function locateElement(root, selector) {
    return root.locator(selector)
}

test.beforeEach(async ({ page }) => {
    await page.goto(testConfigs.url)
})

test.describe('match config with UI', async () => {

    test('are headers being displayed', async ({page})=>{
        let headers = await locateElement(page, '#table thead')
        if (defaultConfig.header) {
            await expect(headers).toBeAttached()
        } else {
            await expect(headers).not.toBeAttached()
        }
    })

    test('is searchbar present when searchale is true and placeholder is correct', async function ({ page }) {
        let searchBar = await locateElement(page, '.dataTable-input')
        if (defaultConfig.searchable) {
            await expect(searchBar).toBeAttached() // assert whether the element is visible
            await expect(await (searchBar.getAttribute('placeholder'))).toEqual(defaultConfig.labels.placeholder) // to assert the placeholder
        } else {
            await expect(searchBar).not.toBeAttached() // assert the input is not in existence
        }
    })

    test('is info text correct', async({ page }) => {
        let infoLabel = await locateElement(page, '.dataTable-info').textContent()
        let tr = await page.$$('#table tbody tr')
        await expect(infoLabel).toEqual(`Showing 1 to ${tr.length} of 30 entries`)
    })

    test('No entries found', async({ page }) => {
        let searchBar = await locateElement(page, '.dataTable-input')
        await searchBar.fill('wrong value') // Intentionally wrong value so that the search breaks
        await searchBar.press('Enter')
        let emptyTable = await locateElement(page, '.dataTables-empty').textContent()
        await expect(emptyTable).toEqual(defaultConfig.labels.noRows)
    })

    test('is initial rows equal to perpage', async({ page }) =>{
        let tr = await page.$$('#table tbody tr')
        await expect(tr.length).toEqual(defaultConfig.perPage)
    })

    test('table top bar is rendering correctly', async({ page }) => {
        let topbar = await page.locator('.dataTable-top')
        if ('' === defaultConfig.layout.top) {
            await expect(topbar).not.toBeAttached()
        } else {
            await expect(topbar).toBeAttached()
            let topLayout = defaultConfig.layout.top
            let topLayoutArr = topLayout.replaceAll('}{', ' ').replace(/{|}/g, '').split(' ')
            for (let i=0; i<topLayoutArr.length; i++) {
                await expect(await locateElement(topbar, `[data-testid = ${topLayoutArr[i]}]`)).toBeAttached()
            }
        }
    })

    test('table bottom bar is rendering correctly', async({ page }) => {
        let bottomBar = await locateElement(page, '.dataTable-bottom')
        if ('' === defaultConfig.layout.bottom) {
            await expect(bottomBar).not.toBeAttached()
        } else {
            await expect(bottomBar).toBeAttached()
            let bottomLayout = defaultConfig.layout.bottom
            let bottomLayoutArr = bottomLayout.replaceAll('}{', ' ').replace(/{|}/g, '').split(' ')
            for (let i=0; i<bottomLayoutArr.length; i++) {
                await expect(await locateElement(bottomBar, `[data-testid = ${bottomLayoutArr[i]}]`)).toBeAttached()
            }
        }
    })

})
