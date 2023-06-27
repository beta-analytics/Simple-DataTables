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

    test('is searchbar present when searchale is true and placeholder is correct', async function ({ page }) {
        let searchBar = await locateElement(page, '.dataTable-input')
        if (defaultConfig.searchable) {
            await expect(searchBar).toBeAttached() // assert whether the element is visible
            await expect(await (searchBar.getAttribute('placeholder'))).toEqual(defaultConfig.labels.placeholder) // to assert the placeholder
        } else {
            await expect(searchBar).not.toBeAttached() // assert the input is not in existence
        }
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
        await searchBar.fill('wrong value') // Intentionally wrong value so that search breaks
        await searchBar.press('Enter')
        let emptyTable = await locateElement(page, '.dataTables-empty').textContent()
        await expect(emptyTable).toEqual(defaultConfig.labels.noRows)
    })

    test('is initial rows equal to perpage', async({ page }) =>{
        let tr = await page.$$('#table tbody tr')

        await expect(tr.length).toEqual(defaultConfig.perPage)
    })

    test('is perpage options correct', async({ page }) => {
        let options = await page.$$('.dataTable-selector option')

        let arr = []

        await options.forEach((option)=>{
            arr.push(option.getAttribute('option'))
        })

        // await expect(arr).toEqual(defaultConfig.perPageSelect)
    })

    test('table top bar is rendering correctly', async({ page }) => {
        let topbar = await page.locator('.dataTable-top')
        let topLayout = defaultConfig.layout.top
        let topLayoutArr = topLayout.replaceAll('}{', ' ').replace(/{|}/g, '').split(' ')
        await expect(await locateElement(topbar, `#${topLayoutArr[0]}`)).toBeAttached()
        await expect(await locateElement(topbar, `#${topLayoutArr[1]}`)).toBeAttached()
        await expect(await locateElement(topbar, `#${topLayoutArr[2]}`)).toBeAttached()
    })

})
