import { test, expect} from '@playwright/test'
import testConfigs from './testconfigs'
import { defaultConfig } from '../../table/src/config'

// function to locate elements dynamically using locator method
function locateElement(root, selector) {
    return root.locator(selector)
}

test.beforeEach(async ({ page }) => {
    page.goto(testConfigs.url)
})

test.describe('match config with UI', async () => {

    test('is searchbar placeholder right', async function ({ page }) {
        let searchBar = await locateElement(page, '.dataTable-input')

        await expect(await (searchBar.getAttribute('placeholder'))).toEqual(defaultConfig.labels.placeholder)
    })

    // test('is perpage label right', async function ({ page }) {
    //     let dropdown = await locateElement(page, '.dataTable-dropdown')
    //     await expect(await (dropdown.getAttribute('class'))).toEqual('dataTable-dropdown')
    // })

    test('is info text correct', async({ page }) => {
        let infoLabel = await locateElement(page, '.dataTable-info').textContent()
        let tr = await page.$$('#table tbody tr')
        await expect(infoLabel).toEqual(`Showing 1 to ${tr.length} of 30 entries`)
    })

    test('No entries found', async({ page }) => {
        let searchBar = await locateElement(page, '.dataTable-input')
        await searchBar.fill('kdjfjie') // Intentionally wrong value so that search break
        await searchBar.press('Enter')
        let emptyTable = await locateElement(page, '.dataTables-empty').textContent()
        await expect(emptyTable).toEqual(defaultConfig.labels.noRows)
    })



})
