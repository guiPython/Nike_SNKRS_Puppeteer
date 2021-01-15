# Node_Puppeteer_Nike_SNKRS

Bot criado em node js com puppeteer para automatizar compras em Nike SKNRS.

Para utilizar o app e necessario configurar o arquivo .env , nele voce deve preencher todas as linhas com seus dados apos o " : " .

Existem duas maneiras de executar este programa:
  
    I ) Utilizando o console na pasta do projeto somente digite:
  
        node index.js
      
Nesta segunda Maneira e necessario que voce saiba para qual S.O deseja gerar o " .exe " deste programa.

Existe uma lista das plataformas suportadas para build no seguinte link:

  https://github.com/nexe/nexe/releases

Recomendo escolher o S.O com a versao 12.16.3 do node js.
      
    II ) Utilizando o nexe js para buildar , abra o console na pasta do projeto e digite:
    
        nexe -t "Insira aqui seu S.O com a versao do Node js" -o ./Build/Bot_Nike
        
        Exemplo:
          
          nexe -t windows-x64-12.16.3  -o ./Build/Bot_Nike
          
*Importante:*

      I) Para que o programa funcione corretamente insira na pasta Build criada a partir do metodo II o arquivo .env
          
      II) Algumas correcoes podem ser feitas nos metodos da pasta src caso tenha problemas de conexao.
          
      III) Em alguns testes reparei que o bloqueio nas requisicoes das imagens nao funcionou muito bem ,
            e uma configuracao opcional , portanto caso deseje retire a linha no arquivo index.js que bloqueia img.
      
Meus agradecimentos , facam bom uso :)
