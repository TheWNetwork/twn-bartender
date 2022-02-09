module.exports.run = async (botconfig, pool, bot, message, args) => {
    let qry = `SELECT frase, rand() as random FROM frases WHERE deleted = 0 AND lang = '${message.from.language_code}' ORDER BY 2 LIMIT 1;`;
    let dbRes = await pool.query(qry);
    return dbRes[0].frase;
};

module.exports.help = {
    name: "frases"
};