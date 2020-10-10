const puppeteer = require('puppeteer-extra');
puppeteer.use(require('puppeteer-extra-plugin-stealth')())
const cron = require('node-cron');
const readLine = require('readline');
const rs = readLine.createInterface(process.stdin,process.stdout)
require('dotenv').config()


const Order = require('./src/order')
const login = require('./src/login')
const EvalEnv = require('./src/evalEnv')


async function run () {

    var date = new Date()

    if ( EvalEnv() ){

        try{
            console.log('\nBOT_TARS INICIADO')
            const path_folder = await Order.mkDirOrder(process.env.CPF,process.env.MODEL)
            const timeL = process.env.TIME.split(':')
            date = Date.parse(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${timeL[0]}:${timeL[1]}`)
            const [ product , id , size ] = [ process.env.MODEL , process.env.ID , process.env.SIZE ] 
            
            
            const browser = await puppeteer.launch({ defaultViewport:null ,headless:true , ignoreHTTPSErrors:true , executablePath:`${process.env.PATH_CHROME}` , args: ['--no-sandbox']})
            const page = await browser.newPage()
            await page.setViewport({ width:1920 , height:1080})
            page.setDefaultNavigationTimeout(0)
            await page.setRequestInterception(true);
            page.on('request', (request) => {
                if (request.resourceType() === 'image') request.abort();
                else request.continue();
            });
            //await page.screenshot({path: `${path_folder}/home_page.png`})

            // Login
            var access = await login( process.env.EMAIL , process.env.PASSWORD , page , path_folder )
            // Order
            if ( access == null ? true : false ){
                if ( Date.now() < date ){ 
                    cron.schedule(`${timeL[1]} ${timeL[0]} * * *`, async () => { await Order.init_Order( page , path_folder , product , id , size , browser ) })}
                else { await Order.initOrder( page , path_folder , product , id , size , browser ) }}
            
        }
        catch(err){
            console.log(err)
            rs.question('\nOcorreu um erro na execucao do programa , Press Enter to close the Application.',(res)=>{process.exit()})
        }}
        else{
            console.log('Insira todas as informacoes em .env\n')
            rs.question('Press Enter to close the Application.',()=>{process.exit()})
        }
} 
run()