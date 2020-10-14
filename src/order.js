const readeline = require('readline')
const Spinner = require('cli-spinner').Spinner
const rs = readeline.createInterface(process.stdin,process.stdout)
const path = require('path')
const fs = require('fs')
const retry = require('./retry')

async function mkDirOrder(cpf,model){
        // Pasta Comprovante do pedido
        const dir = path.resolve(process.cwd(),'Comprovantes',`${model}-${cpf}`)
        return await fs.promises.access(dir).then(() => {return dir}).catch( async () => {await fs.promises.mkdir(dir,{recursive: true}) ;  return dir })
}

async function initOrder( page , path_folder , product , id , size , browser , timeOut){

        console.log()
        var spinner = new Spinner('Page Loading: processing.. %s');
        spinner.setSpinnerString('|/-\\');
        spinner.start();
        try{ await retry( async () => { Promise.all ([
                page.setDefaultNavigationTimeout(0),
                await page.goto(`https://www.nike.com.br/Snkrs/Produto/${product}/${id}`),
                await page.waitForXPath('/html/body/main/div/div[1]/div[3]/div/div[2]/div[4]/div/div[2]/button'),
                await page.evaluate( (size)=>{document.querySelector(`label[for=tamanho__id${size}]`).click()} , size )])} , 3 ) }
        catch{  spinner.stop() ; console.log('\nProduct not exists.') ; return rs.question('\nPress Enter to close the Application.',async ()=>{await browser.close() ; process.exit()})}
        spinner.stop()
        console.log()

        spinner = new Spinner('Select Product: processing.. %s');
        spinner.setSpinnerString('|/-\\')
        spinner.start()
        try { await retry ( async () => { Promise.all([
                page.setDefaultNavigationTimeout(timeOut + 2000),
                await page.screenshot({path: `${path_folder}/set_product_page.png`  }),
                await page.click('#btn-comprar'),]) , 3})}
        catch{ spinner.stop() ; console.log('\n NOT Selected Product.') ; return rs.question('\nPress Enter to close the Application.',async ()=>{await browser.close() ; process.exit()}) }
        spinner.stop() 
        console.log('\nSelected Product')


        console.log()
        spinner = new Spinner('Init Buy: processing.. %s');
        spinner.setSpinnerString('|/-\\')
        spinner.start()
        page.setDefaultNavigationTimeout(0)
        await page.waitForNavigation({waitUntil:'domcontentloaded'})
        await page.click('#carrinho > div.ckt__bg-full > div > div:nth-child(4) > a')
        console.time('\nThe entire purchase process was completed in: ')
        spinner.stop()
        console.log('\nBuy Initiated')


        console.log()
        spinner = new Spinner('Confirm Address: processing.. %s');
        spinner.setSpinnerString('|/-\\')
        spinner.start()
        await page.waitForNavigation({waitUntil:'networkidle2'})
        await page.click('#seguir-pagamento')
        await page.waitForSelector('body > div.modal-backdrop.fade.show')
        await page.waitForSelector('div[id^="modalNotice_"',{visible:true})
        await page.waitForTimeout(500)
        await page.evaluate( () => document.querySelector('button.button.undefined').click() )
        spinner.stop()
        console.log('\nConfirmed Address')


        console.log()
        spinner = new Spinner('Accepting Trade-Terms: processing.. %s');
        spinner.setSpinnerString('|/-\\')
        spinner.start()
        await page.waitForSelector('#politica-trocas-label',{visible:true})
        const lb_terms = await page.$('#politica-trocas-label')
        await page.waitForTimeout(500)
        const lb_terms_pst = await page.evaluate(lb_terms => {const { top, left, width, height } = lb_terms.getBoundingClientRect();return { top, left, width, height }},lb_terms)
        await page.mouse.click(lb_terms_pst.left + lb_terms_pst.width - 1 , lb_terms_pst.top + lb_terms_pst.height - 1)
        spinner.stop()
        console.log('\nAccepted Trade-Terms')

        
        console.log()
        spinner = new Spinner('Finalizing Buy: processing.. %s');
        spinner.setSpinnerString('|/-\\')
        spinner.start()
        await page.click('#confirmar-pagamento')
        await page.screenshot({path: `${path_folder}/confirm_buy_page.png`  })
        console.timeEnd('\nThe entire purchase process was completed in: ')

        setTimeout( () => {
                spinner.stop()
                console.log(`\nSuccessful Buy \nCheck the folder: ${path_folder}`)
                rs.question('\nPress Enter to close the Application.',async ()=>{await browser.close() ; process.exit()}),10000 })
        
}

module.exports = { initOrder , mkDirOrder }