const puppeteer = require('puppeteer');

async function Login(page,email,senha){
    await page.waitForXPath('/html/body/div[8]/div/div/div[2]/div[5]/form/div[2]/input')
    await page.waitForTimeout(200)
    await page.type('input[name="emailAddress"]',email,{delay:100})
    await page.type('input[name="password"',senha,{delay:100})
    await page.keyboard.press('Enter')
    await page.waitForNavigation('load')
}

async function Comprar(page,size){
    await page.mouse.down()
    await page.waitForXPath(`//label[contains(text(),'${size}')]`,{
        visible:true
    })
    console.log('Sizes renderizados')
    await page.click(`#tamanho__id${size}`)
    console.log('Size Definido')
    await page.click('#btn-comprar')
    console.log('Inserindo no Carrinho')
    await page.waitForNavigation()
    console.log('Produto no Carrinho')
}

async function run( model, size , email , senha ){
    const browser = await puppeteer.launch(
        {
            ignoreHTTPSErrors: true,
            headless: false
        }
    )

    const page_login = await browser.newPage()

    await page_login.goto(`https://www.nike.com.br/Snkrs`)
    page_login.waitForNavigation({waitUntil:'networkidle0'})

    await page_login.evaluate(()=>{
        document.getElementById('anchor-acessar').click()
        console.log('Login Aberto')
    })

    await Login(page_login,email,senha)
    const page_produto = await browser.newPage()
    await page_produto.goto(`https://www.nike.com.br/Snkrs/Produto/${model}`)
    await page_produto.waitForNavigation({waitUntil:'load'})
    await Comprar(page_produto,size)
}

run('ISPA-OverReact-FlyKnit/153-169-211-260419','42','guirox.wd@gmail.com','Lask1234')

