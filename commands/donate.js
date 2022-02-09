module.exports.run = async (botconfig, pool, bot, message, args) => {
    await bot.sendMessage(message.chat.id, `Donate to improve and pay our servers\n\nYou can check our services on @TheWNetwork.`,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: 'Paypal', url: 'https://www.paypal.me/elsalundqvist'},
                        {text: 'Patreon', url: 'https://www.patreon.com/TheWNetwork'}
                    ]
                ]
            }
        }
    );
};

module.exports.help = {
    name: "donate"
};