const readeline = require('readline')
const rs = readeline.createInterface(process.stdin,process.stdout)
const path = require('path')
const fs = require('fs')

async function mkDirOrder(cpf,model){
        // Pasta Comprovante do pedido
        const dir = path.resolve(process.cwd(),'Comprovantes',`${model}-${cpf}`)
        return await fs.promises.access(dir).then(() => {return dir}).catch( async () => {await fs.promises.mkdir(dir,{recursive: true}) ;  return dir })
}

async function initOrder( page , path_folder , product , id , size , browser ){
        await page.goto(`https://www.nike.com.br/Snkrs/Produto/${product}/${id}`)
        await page.waitForXPath('/html/body/main/div/div[1]/div[3]/div/div[2]/div[4]/div/div[2]/button')
        await page.evaluate( (size)=>{document.querySelector(`label[for=tamanho__id${size}]`).click()} , size )
        await page.screenshot({path: `${path_folder}/set_product_page.png`  })
        await page.click('#btn-comprar')
        console.log('\nProduto Selecionado')
        await page.waitForNavigation({waitUntil:'domcontentloaded'})
        await page.click('#carrinho > div.ckt__bg-full > div > div:nth-child(4) > a')
        console.time()
        console.log('\nCompra Iniciada')
        await page.waitForNavigation({waitUntil:'networkidle2'})
        await page.click('#seguir-pagamento')
        await page.waitForSelector('body > div.modal-backdrop.fade.show')
        await page.waitForSelector('div[id^="modalNotice_"',{visible:true})
        await page.waitForTimeout(500)
        await page.evaluate( () => document.querySelector('button.button.undefined').click() )
        console.log('\nEndereco Confirmado')
        await page.waitForSelector('#politica-trocas-label',{visible:true})
        const lb_terms = await page.$('#politica-trocas-label')
        await page.waitForTimeout(500)
        const lb_terms_pst = await page.evaluate(lb_terms => {const { top, left, width, height } = lb_terms.getBoundingClientRect();return { top, left, width, height }},lb_terms)
        await page.mouse.click(lb_terms_pst.left + lb_terms_pst.width - 1 , lb_terms_pst.top + lb_terms_pst.height - 1)
        console.log('\nTermo de Troca Aceito')
        await page.click('#confirmar-pagamento')
        await page.screenshot({path: `${path_folder}/confirm_buy_page.png`  })
        console.log(`\nCompra Efetuada Com Sucesso\nVerfique a pasta: ${path_folder}`)
        console.timeEnd()
        rs.question('\nPressione Enter para fechar a Aplicacao.',async ()=>{await browser.close() ; process.exit()})
}

module.exports = { initOrder , mkDirOrder }