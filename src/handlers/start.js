const {welcomeKeyboard} = require('../keyboards/welcomeKeyboard')

async function startHandler (ctx) 
{
    await ctx.reply(`*Добро\ пожаловать*    _${ctx.from.first_name}_`,
        {
            parse_mode: "MarkdownV2",
            reply_markup: welcomeKeyboard
        })
}
module.exports = {startHandler }