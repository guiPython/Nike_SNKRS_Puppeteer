const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const readLine = require('readline')
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');


puppeteer.use(pluginStealth())
const rs = readLine.createInterface(process.stdin,process.stdout)


async function mkDir(cpf,model){
    const dir = path.resolve(process.cwd(),'Comprovantes',`${model}-${cpf}`)
    console.log(dir)
    return await fs.promises.access(dir).then(() => {return dir}).catch( async () => {await fs.promises.mkdir(dir,{recursive: true}) ;  return dir })
}


function info(){
    try{
        var data = fs.readFileSync(path.resolve(process.cwd(),'info.txt'),'utf8')
        const lines = data.split(/\r?\n/)
        for (var i = 0 ; i < lines.length ; i++ ){
                lines[i] = lines[i].split(':')[1]
        }
        return lines
    }
    catch(error){
        console.log('ERROR: ' , error.stack)
    }
}

async function login( email , senha , page , path_folder ){
    await page.click('#anchor-acessar')
    await page.waitForTimeout(500)
    await page.type('input[name="emailAddress"]',email,{delay:100})
    await page.waitForTimeout(200)
    await page.type('input[name="password"',senha,{delay:200})
    await page.screenshot({path: `${path_folder}/login_page.png` })
    await page.waitForTimeout(5000)
    await page.keyboard.press('Enter')
    console.log('Login Efetuado')
}

async function set_product( product , size , id , page , path_folder ){
    await page.goto(`https://www.nike.com.br/Snkrs/Produto/${product}/${id}`)
    await page.waitForXPath('/html/body/main/div/div[1]/div[3]/div/div[2]/div[4]/div/div[2]/button')
    await page.waitForTimeout(200)
    await page.evaluate( (size)=>{document.querySelector(`label[for=tamanho__id${size}]`).click()} , size )
    await page.screenshot({path: `${path_folder}/set_product_page.png`  })
    await page.click('#btn-comprar')
    console.log('Produto Selecionado')
}

async function address( page ){
    // Confirmar Endereco 
        await page.waitForNavigation({waitUntil:'networkidle0'})
        await page.click('#seguir-pagamento')
        await page.waitForSelector('body > div.modal-backdrop.fade.show')

    // Click Confirmar Endereco
        await page.waitForSelector('div[id^="modalNotice_"',{visible:true})
        await page.waitForTimeout(500)
        await page.evaluate( () => document.querySelector('button.button.undefined').click() )
    console.log('\nEndereco Confirmado')
}


async  function  terms( page ){
    // Aceitar termo de troca
        await page.waitForSelector('#politica-trocas-label',{visible:true})
        await page.waitForTimeout(500)
        const lb_terms = await page.$('#politica-trocas-label')
        const lb_terms_pst = await page.evaluate(lb_terms => {const { top, left, width, height } = lb_terms.getBoundingClientRect();return { top, left, width, height }},lb_terms)
        await page.mouse.click(lb_terms_pst.left + lb_terms_pst.width - 1 , lb_terms_pst.top + lb_terms_pst.height - 1)
        console.log('\nTermo de Troca Aceito')
}


async function confirm_buy( page , path_folder ){
    // Confirmar envio
        await page.click('#confirmar-pagamento')
        await page.screenshot({path: `${path_folder}/confirm_buy_page.png`  })
        console.log('\nCompra Efetuada Com Sucesso , Verfique a pasta comprovantes\nA Pasta de Sua Compra segue o Formato Model-CPF')
        await browser.close()
        rs.question('Pressione Enter para fechar a Aplicacao.',(res)=>{process.exit()})
}


async function init_buy( page ){
    // Iniciar Compra
        await page.waitForNavigation({waitUntil:'domcontentloaded'})
        await page.click('#carrinho > div.ckt__bg-full > div > div:nth-child(4) > a')
        console.log('\nCompra Iniciada')
}


async function run () {

    const array_info = info()

    if ( ! array_info.includes('') ){

        try{
        console.log('BOT_TARS INICIADO')
        const path_folder = await mkDir(array_info[6],array_info[2])
        console.log(path_folder)
        const time = array_info[5].split('-')

        
        const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || (process.pkg ? path.join(path.dirname(process.execPath),'puppeteer',...puppeteer.executablePath().split(path.sep).slice(6),) : puppeteer.executablePath())
        

        const browser = await puppeteer.launch({ headless:false , ignoreHTTPSErrors:true , executablePath})
        const page = await browser.newPage()
        page.setDefaultNavigationTimeout(0)
        await page.setViewport({ width:1920 , height:1080})


        await page.goto('https://www.nike.com.br')
        await page.screenshot({path: `${path_folder}/home_page.png`})

        await login( array_info[0], array_info[1] , page , path_folder )
        cron.schedule(`${time[1]} ${time[0]} * * *`, async () => {

            await set_product( array_info[2] , array_info[4] , array_info[3] , page , path_folder );

            await init_buy( page )

            await address( page )

            await terms( page )
            
            await confirm_buy( page , path_folder )


        })}
        catch{
            rs.question('Ocorreu um erro na execucao do programa , precione ENTER e execute novamente.',(res)=>{process.exit()})
        }}
        else{
            console.log('Insira todas as informacoes em info.txt')
            process.exit()
        }
} 
run()