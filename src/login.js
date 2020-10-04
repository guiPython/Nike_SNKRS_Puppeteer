async function login( email , senha , page , path_folder ){
    await page.click('#anchor-acessar')
    await page.waitForTimeout(500)
    await page.type('input[name="emailAddress"]',email,{delay:100})
    await page.waitForTimeout(200)
    await page.type('input[name="password"',senha,{delay:200})
    await page.screenshot({path: `${path_folder}/login_page.png` })
    await page.waitForTimeout(5000)
    await page.keyboard.press('Enter')
    await page.waitForNavigation({waitUntil:'networkidle2'})
    console.log('\nLogin Efetuado')
}

module.exports = login