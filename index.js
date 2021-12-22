const WebSocket = require('ws');
const chalk = require('chalk');
const fs = require('fs');
console.clear();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let accounts = fs.readFileSync('./accounts.txt').toString().split('\r\n');
let CONFIGtemp = fs.readFileSync('./config.txt').toString().split('\r\n').map(el=>({[el.split("=")[0]]: el.split("=")[1]}))
let CONFIG = {};
for (const i in CONFIGtemp) {
    for (const key in CONFIGtemp[i]) {
           if(isNaN(Number('f'))){
            CONFIG = {...CONFIG, [key]: CONFIGtemp[i][key]}
           }
            
    }
    
}

let recaptcha = fs.readFileSync('./captcha.txt').toString().split('\r\n');

console.log(CONFIG.help == '1' ? `let temp = document.querySelector("#g-recaptcha-response").value
setInterval(()=>{
if(temp != document.querySelector("#g-recaptcha-response").value){
console.log(document.querySelector("#g-recaptcha-response").value)
temp = document.querySelector("#g-recaptcha-response").value
}}, 1000)`:"")

function connect() {
    var ws = new WebSocket(`wss://${CONFIG.domain}:2083/socket.io/?EIO=3&transport=websocket`);

ws.on('open', function open() {
    ws.send(`420["join",{"ott":"${CONFIG.ott}"}]`)
    console.log(chalk.green(">   " + 'Joined'));
    ws.send(2)
    setInterval(() => {
        console.log(chalk.green(">   " + '2'));
        ws.send(2)
    }, CONFIG.delay);
});

ws.on('message', async function message(data) {
  console.log(chalk.blue('<   ' + data.toString()));
  if(data.toString().substring(0, 2) == '42'){
    data = JSON.parse(data.toString().substring(2))
    const promo = data[1]?.newPromoQuery?.name;
    console.log(chalk.bold(promo));

    recaptcha = fs.readFileSync('./captcha.txt').toString().split('\r\n')
    console.log(chalk.yellow('Captсha list updated'));

    accounts.forEach(async(account, num) => {
        fetch(`https://${CONFIG.domain}/api/user/freebie/promo`, {
       method: 'POST', 
       body: JSON.stringify({exclusive: false, promocode: promo, "captcha": recaptcha[num]}),
       headers: {
          "content-type": "application/json",
          "meta-data": account,
          "cookie": `id=${account}`,
       }
   }).then(r=> r.json()).then(r=>{if(r.ok == true){console.log(chalk.greenBright("PROMO +++ " + account + " " + JSON.stringify(r) + " " ))}else{console.log( JSON.stringify(r) + ' '+ account )}})
   });
    
  }
});


ws.on('close', (msg)=>{
    console.log(chalk.red('Connection closed'));
    console.log(msg);

    setTimeout(function() {
        connect();
      }, 1000);
})

ws.on('error', (err)=>{
    console.log(chalk.red('Connection Error'));
    console.log(err);
})}



connect()