const Spinner = require('cli-spinner').Spinner
const retry = require('./retry')

const readLine = require('readline');
const rs = readLine.createInterface(process.stdin,process.stdout)

async function login( email , senha , page , path_folder , timeOut){
    console.log()
    page.setDefaultNavigationTimeout(20000);
    var spinner = new Spinner('Login: processing.. %s');
    spinner.setSpinnerString('|/-\\');
    spinner.start();
    try{
    await retry ( async () => { Promise.all([
            await page.goto('https://www.nike.com.br'),
            await page.click('#anchor-acessar'),
            await page.waitForTimeout(500),
            await page.type('input[name="emailAddress"]',email,{delay:100}),
            await page.waitForTimeout(200),
            await page.type('input[name="password"',senha,{delay:200}),
            await page.screenshot({path: `${path_folder}/login_page.png` }),
            await page.waitForTimeout(200),
            await page.keyboard.press('Enter'),
            page.setDefaultNavigationTimeout(timeOut + 5000),
            await page.waitForNavigation({waitUntil:'networkidle2'}),
            page.setDefaultNavigationTimeout(timeOut),
            await page.waitForXPath('//*[@id="header"]/div[1]/div/div/div[2]/span[1]/span[1]/span/a')
        ])},3)}
    catch{
        spinner.stop() ; console.log('\nEmail or Password not exists') ; rs.question('\nPress Enter to close the Application.',()=>{process.exit()}) ; return false}
    spinner.stop() 
    console.log('\nLogin Efetuado')
    }
    
    


module.exports = login

