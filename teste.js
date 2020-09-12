const puppeteer = require('puppeteer');


    async function Login(page,email,senha){
        await page.waitForXPath('/html/body/div[8]/div/div/div[2]/div[5]/form/div[2]/input')
        await page.waitForTimeout(200)
        await page.type('input[name="emailAddress"]',email,{delay:70})
        await page.type('input[name="password"',senha,{delay:70})
        await page.keyboard.press('Enter')
        await page.waitForNavigation('load')
    }

    async function Buy(page,size){
        await page.evaluate(()=>{window.scrollTo(0,1400)})
        await page.waitFor(500)
        await page.evaluate((size)=>{document.querySelector(`label[for=tamanho__id${size}]`).click()},size)
        await page.waitFor(500)
        await page.evaluate(()=>{document.querySelector('#btn-comprar').click()})
    }


async function run( model, size , email , senha ){


    const browser = await puppeteer.launch(
        {
            ignoreHTTPSErrors: true,
            headless: false
        }
    )

    const page_login = await browser.newPage()

    // Login
    await page_login.goto(`https://www.nike.com.br/Snkrs`)
    page_login.waitForNavigation({waitUntil:'networkidle0'})

    await page_login.evaluate(()=>{
        document.getElementById('anchor-acessar').click()
        console.log('Login Aberto')
    })
    await Login(page_login,email,senha)

    await page_login.waitForNavigation('load')

    // Comprar
    const page_produto = await browser.newPage()
    await page_produto.goto(`https://www.nike.com.br/Snkrs/Produto/${model}`)
    await Buy(page_produto,size)
    
}

run('ISPA-OverReact-FlyKnit/153-169-211-260419','42','guirox.wd@gmail.com','Lask1234')

