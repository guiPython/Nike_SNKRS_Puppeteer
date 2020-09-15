const puppeteer = require('puppeteer');
const cron = require('node-cron')

async function login( email , senha , page ){
    await page.click('#anchor-acessar')
    await page.waitForTimeout(500)
    await page.type('input[name="emailAddress"]',email,{delay:100})
    await page.waitForTimeout(200)
    await page.type('input[name="password"',senha,{delay:200})
    await page.screenshot({path:'login_page.png'})
    await page.keyboard.press('Enter')
}

async function set_product( product , size , page ){
    await page.goto(`https://www.nike.com.br/Snkrs/Produto/${product}`)
    await page.waitForXPath('/html/body/main/div/div[1]/div[3]/div/div[2]/div[4]/div/div[2]/button')
    await page.waitForTimeout(200)
    await page.evaluate((size)=>{document.querySelector(`label[for=tamanho__id${size}]`).click()} , size )
    await page.screenshot({path:'set_product.png'})
    await page.click('#btn-comprar')
}

async function buy_product( page ){
    await page.click('#carrinho > div.ckt__bg-full > div > div:nth-child(4) > a')
    await page.waitForTimeout(300)
    await page.click('#seguir-pagamento')
    await page.waitForTimeout(300)
    await page.screenshot({path:'confirm_address.png'})
}

async function run () {
    const browser = await puppeteer.launch({headless:false})
    const page = await browser.newPage()
    await page.setViewport({ width:1280 , height:720})
    await page.goto('https://www.nike.com.br/Snkrs')
    await page.screenshot({path: 'home_page.png'})

    await login('guirox.wd@gmail.com','Lask1234' , page)
    cron.schedule('37 19 * * *', async () => {
        await set_product('DBreak-Type/153-169-211-256298' , '42' , page);
        await buy_product(page)
    })
    

} 

run()
