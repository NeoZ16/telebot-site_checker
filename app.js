const TELEGRAM_BOT_TOKEN = process.env.tel_bot_key;
const resultLink = process.env.resultLink;
const port = process.env.PORT || 5000;
const TeleBot = require('telebot');
const request = require('request');
const http = require('http');
const interval = 1000*60*process.env.interval;
const bot = new TeleBot(TELEGRAM_BOT_TOKEN);
let checkingUpdates;
bot.on(['/start'], (msg) => {
    if(checkingUpdates == null) {
        console.log('request started');
        msg.reply.text('Bot will now check every ' + interval / 1000 / 60 + ' minutes.');
        getUpdates(resultLink, msg);
        checkingUpdates = setInterval(() => {
            getUpdates(resultLink, msg);
        }, interval);
    }else{
        msg.reply.text('Already started.\nBot checks every ' + interval / 1000 / 60 + ' minutes.');
    }
});

bot.on(['/stop'], (msg) => {
    if(checkingUpdates!=null) {
        console.log('request stopped');
        msg.reply.text('Bot will stop checking');
        clearInterval(checkingUpdates);
        checkingUpdates = null;
    }else{
        msg.reply.text('Bot does not know any job like that.')
    }
});

bot.on('sticker', (msg) => {
    return msg.reply.sticker('http://i.imgur.com/VRYdhuD.png', { asReply: true });
});

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, function (){
  console.log(`Server running at ${port}`);
});

bot.start();

function getUpdates(resultLink, msg){
    //msg.reply.text(resultLink);
    return new Promise(function (resolve, reject)
    {
        request(resultLink, function (error, response, body) {
            if(response.statusCode>= 400 && response.statusCode < 500){
                msg.reply.text('No Update // StatusCode'+response.statusCode);
            }else if(response.statusCode >= 200 && response.statusCode < 300){
                msg.reply.text('Update at Url\n'+resultLink);
            }
            resolve(body);
        });
    });
}
