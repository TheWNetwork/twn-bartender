module.exports.run = async (botconfig, dbclient, bot, message, provider) => {
    return`@${botconfig.name} es un bot que te insulta cuando insultas. Facil, sencillo y para toda la familia.
Esperabas algo mas de mi? Lo siento, mejor visita @TheWNetwork a ver si alguien te quita la infelicidad que tienes encima.`;
};

module.exports.help = {
    name: "help"
};