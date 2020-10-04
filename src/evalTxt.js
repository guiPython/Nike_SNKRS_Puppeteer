const path = require('path')
const fs = require('fs')

function infotxt(){
    try{
        var data = fs.readFileSync(path.resolve(process.cwd(),'inform.txt'),'utf8')
        const lines = data.split(/\r?\n/)
        for (var i = 0 ; i < lines.length ; i++ ){ if ( i != lines.length -1) {lines[i] = lines[i].split(':')[1] } else{ lines[i] = lines[i].split('path_chrome:')[1]}}
        return lines
    }
    catch(error){ console.log('ERROR: ' , error.stack) }
}

function eval(info){
    const errors = [
        'Insira um email valido no arquivo info.txt',
        'Insira sua senha valida no arquivo info.txt',
        'Insira um modelo valido no arquivo info.txt',
        'Insira o id do produto no arquivo info.txt',
        'Insira o tamanho do produto no arquivo info.txt',
        'Insira o horario de execucao no arquivo info.txt no formato HH-MM',
        'Insira um CPF valido no arquivo info.txt',
        'Insira um path valido para o Chrome.exe no arquivo info.txt'
    ]
    if ( info.includes('') ){
        for ( var i = 0 ; i < info.length ; i++){
            if ( info[i] == ''){ console.log(`\n${errors[i]}`) }
        }
        return false
    }
    else{ return true }
}

module.exports = { eval , infotxt }