const TELEGRAM_BOT_TOKEN = process.env.tel_bot_key;
const resultLink = process.env.resultLink;
const port = process.env.PORT || 5000;
const TeleBot = require('telebot');
const request = require('request');
const interval = 1000*60*process.env.interval;
const bot = new TeleBot(TELEGRAM_BOT_TOKEN);
let checkingUpdates;
bot.on(['/start'], (msg) => {
    msg.reply.text('Bot will now check every '+interval/1000/60+' minutes');
    checkingUpdates = setInterval(()=>{
        getUpdates(resultLink, msg);
    }, interval);
});

bot.on(['/stop'], (msg) => {
    msg.reply.text('Bot will stop checking');
    clearInterval(checkingUpdates, msg);
});

bot.on('sticker', (msg) => {
    return msg.reply.sticker('http://i.imgur.com/VRYdhuD.png', { asReply: true });
});

bot.start();

return new Promise(function (resolve, reject)
    {
        request(resultLink, function (error, response, body) {
            console.log(error);
            console.log(typeof (response.statusCode));
            if(response.statusCode>= 400 && response.statusCode < 500){
                console.log('No Update // StatusCode'+response.statusCode);
            }else if(response.statusCode >= 200 && response.statusCode < 300){
                console.log('Update at Url\n'+resultLink);
            }
        });
    });

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port,() => {
  console.log(`Server running at ${port}`);
});

function getUpdates(resultLink, msg){
    //msg.reply.text(resultLink);
    return new Promise(function (resolve, reject)
    {
        request(resultLink, function (error, response, body) {
            console.log(error);
            console.log(typeof (response.statusCode));
            if(response.statusCode>= 400 && response.statusCode < 500){
                msg.reply.text('No Update // StatusCode'+response.statusCode);
            }else if(response.statusCode >= 200 && response.statusCode < 300){
                msg.reply.text('Update at Url\n'+resultLink);
            }
            resolve(body);
        });
    });
}