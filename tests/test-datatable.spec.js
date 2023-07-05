import { test, expect } from '@playwright/test'
import testConfigs from './testconfigs'
import { defaultConfig } from '../../table/src/config'

// function to locate elements dynamically using locator method
async function locateElement(root, selector) {
    return root.locator(selector)
}

test.describe('datatable test', async () => {

    let page
    test.describe.serial('topbar (dataTable-top) dependent test cases', async () => {

        test.beforeAll(async ({ browser }) => {
            let context = await browser.newContext()
            page = await context.newPage()
            await page.goto(testConfigs.url)
        })

        test.afterAll(async ({ browser }) => {
            browser.close()
        })

        test('api test', async () => {
            let res = await page.request.get('http://127.0.0.1:8000')
            await expect(res).toBeOK()
        })

        test('table top bar is only rendering when layout is present', async () => {
            let topbar = await locateElement(page, '.dataTable-top')
            if (!defaultConfig.layout) {
                await expect(topbar).not.toBeAttached()
            } else {
                await expect(topbar).toBeAttached()
            }
        })

        test('table top bar is only rendering when layout.top is non empty', async () => {
            let topbar = await locateElement(page, '.dataTable-top')
            if (defaultConfig.layout) {
                if ('' !== defaultConfig.layout.top) {
                    await expect(topbar).toBeAttached()
                } else {
                    await expect(topbar).not.toBeAttached()
                }
            }
        })

        test('table top bar is rendering correct child element as passed with options', async () => {
            let topbar = await locateElement(page, '.dataTable-top')

            let topLayout = defaultConfig.layout.top
            let topLayoutArr = topLayout.replaceAll('}{', ' ').replace(/{|}/g, '').split(' ')
            for (let i = 0; i < topLayoutArr.length; i++) {
                await expect(await locateElement(topbar, `[data-testid = ${topLayoutArr[i]}]`)).toBeAttached()
            }
        })

        test('searchbar is present only when searchable is true', async () => {
            let searchBar = await locateElement(page, '.dataTable-input')
            if (defaultConfig.searchable) {
                await expect(searchBar).toBeAttached() // assert the element is visible
            } else {
                await expect(searchBar).not.toBeAttached() // assert the input is not in existence
            }
        })

        test('is placeholder for searchbar correct', async () => {
            let searchBar = await locateElement(page, '.dataTable-input')
            await expect(await (searchBar.getAttribute('placeholder'))).toEqual(defaultConfig.labels.placeholder) // to assert the placeholder
        })

        test('are the options shown correct in colsearch dropdown', async () => {
            let headers = await page.$$('#table thead tr th')
            let dropdownOpts = await page.$$('.dataTable-columnselector option')

            for (let i=0; i<headers.length; i++) {
                await expect(await dropdownOpts[i+1].textContent()).toEqual(await headers[i].textContent())
            }
        })

    })

    test.describe.serial('bottombar (dataTable-bottom) dependent test cases', async ()=>{

        test.beforeAll(async ({ browser }) => {
            let context = await browser.newContext()
            page = await context.newPage()
            await page.goto(testConfigs.url)
        })

        test.afterAll(async ({ browser }) => {
            browser.close()
        })


        test('table bottom bar is only rendering when layout is present', async () => {
            let bottombar = await locateElement(page, '.dataTable-bottom')
            if (!defaultConfig.layout) {
                await expect(bottombar).not.toBeAttached()
            } else {
                await expect(bottombar).toBeAttached()
            }
        })

        test('table bottom bar is only rendering when layout.bottom is non empty', async () => {
            let bottombar = await locateElement(page, '.dataTable-bottom', 'bottombar')
            if ('' !== defaultConfig.layout.bottom) {
                await expect(bottombar).toBeAttached()
            } else {l
                await expect(bottombar).not.toBeAttached()
            }
        })

        test('table bottom bar is rendering correct child elements as passed with options', async () => {
            let bottombar = await locateElement(page, '.dataTable-bottom', 'bottombar')
            let bottomLayout = defaultConfig.layout.bottom
            let bottomLayoutArr = bottomLayout.replaceAll('}{', ' ').replace(/{|}/g, '').split(' ')
            for (let i = 0; i < bottomLayoutArr.length; i++) {
                await expect(await locateElement(bottombar, `[data-testid = ${bottomLayoutArr[i]}]`)).toBeAttached()
            }
        })

        test('is info text correct', async () => {
            let infoLabel = await locateElement(page, '.dataTable-info')
            let tr = await page.$$('#table tbody tr')
            await expect(await (infoLabel.textContent())).toEqual(`Showing 1 to ${tr.length} of 30 entries`)
        })

    })

    test.describe.serial('match config with UI', async () => {
        test.beforeEach(async ({ browser }) => {
            let context = await browser.newContext()
            page = await context.newPage()
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

        test('perpageselect dropdown has options', async () => {
            let perPageSelector = await page.$$('.dataTable-selector option')
            for (let i=0; i<perPageSelector.length; i++) {
                expect(parseInt(await perPageSelector[i].getAttribute('value'))).toEqual(defaultConfig.perPageSelect[i])
            }
        })

        test('is perpage dropdown working fine', async () => {
            let perPageSelector = await locateElement(page, '.dataTable-selector')
            let options = await locateElement(perPageSelector, 'option')
            let tr = await page.$$('#table tbody tr')

            for (let i=0; i<options.length; i++) {
                await perPageSelector.selectOption(options[i])
                expect(await (tr.length)).toEqual(await options[i].value)
            }
        })

    })

})
