const botconfig = require("./config/config.json");
const fs = require("fs");
const mysql = require('promise-mysql');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(botconfig.token, {polling: true});
var pool;
(async () => {
    pool = await mysql.createPool({
        "connectionLimit": 113,
        "host": botconfig.mysqlConnection.host,
        "port": botconfig.mysqlConnection.port,
        "user": botconfig.mysqlConnection.user,
        "password": botconfig.mysqlConnection.password,
        "database": botconfig.mysqlConnection.database,
    });
})();

function checkProfanity(message, magicwords) {
    for (var word of message) {
        if (magicwords.indexOf(word.toLowerCase()) > -1) {
            console.log(1);
            return true;
        }
    }
    return false;
}

bot.commands = new Map();

fs.readdir("./commands/", (err, files) => {
    if (err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
        console.log("Couldn't find commands.");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });
});

bot.on('getUpdates', (update) => {
    console.log(update);
});

bot.on('message', (msg) => {
    try {
        let messageArray = [];
        let cmd = '';
        let args = [];
        let commandRequest = '';
        (async () => {
            try {
                try {
                    messageArray = msg.text.split(" ");
                    cmd = messageArray[0];
                    args = msg.text.slice(cmd.length + 1);
                    commandRequest = cmd.slice(1);
                } catch (e) {

                }

                let commandfile = bot.commands.get(commandRequest.substring(0, (commandRequest.indexOf('@') === -1 ? commandRequest.length : commandRequest.indexOf('@'))));
                if (commandfile) {
                    bot.sendMessage(msg.chat.id, await commandfile.run(botconfig, pool, bot, msg, args));
                } else if (typeof msg.new_chat_participant !== 'undefined') {
                    if(msg.new_chat_participant.id === 5238618409) {
                        bot.sendMessage(msg.chat.id, 'Ha llegado el chatarrero, digo Camarero.\nCansado de que jueguen con tus sentimientos? Pues ahora he llegado yo para seguir jugando con ellos, pero al menos haciendote reir.\n Cada vez que vea un insulto a alguien del chat, me encargaré de devolverte el favor.\n\nBot ofrecido por @TheWNetwork');
                    }
                } else if (checkProfanity(messageArray, botconfig.prefixlist)) {
                    commandfile = bot.commands.get('frases');
                    bot.sendMessage(msg.chat.id, await commandfile.run(botconfig, pool, bot, msg, args));
                }
            } catch (e) {
                console.log(e.message);
            }
        })();
    } catch (e) {
        console.log(e.message);
    }
});

bot.on('inline_query', (msg) => {
    try {
        let commandfile = bot.commands.get('frases');
        if (commandfile) {
            commandfile.run(botconfig, pool, bot, msg, null).then(returntext => {
                bot.answerInlineQuery(msg.id, [
                    {
                        type: 'article',
                        id: 'bartender_userid',
                        title: `Who am i`,
                        input_message_content: {
                            message_text: `User ID: ${msg.from.id}`
                        }
                    },
                    {
                        type: 'article',
                        id: 'bartender_frase',
                        title: `Are you really stupid`,
                        input_message_content: {
                            message_text: returntext
                        }
                    },
                ], {cache_time: 0, is_personal: true});
            });
        }
    } catch (e) {
        console.log(e.message);
    }
})

