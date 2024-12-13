require('dotenv').config();
const {Bot, GrammyError, HttpError, Keyboard, InlineKeyboard} = require('grammy')
const {hydrate} = require('@grammyjs/hydrate')

const bot = new Bot(process.env.BOT_API_KEY)
bot.use(hydrate())

bot.api.setMyCommands([
    {
        command: 'start', 
        description: 'Запустить бота',
    },
    {
        command: 'share',
        description: 'Поделиться данными'
    },
    // {
    //     command: 'calculation',
    //     description: 'Расчитать вес'
    // },
    {
        command: 'select',
        description: 'Выбрать'
    },
    {
        command: 'select_level',
        description: 'Выбрать уровень'
    },
    {
        command: 'menu',
        description: 'Получить меню'
    }

]);
bot.command('start', async(ctx) =>
{
    await ctx.reply('Привет я Бот')
})

// bot.command('select', async (ctx) =>
// {
//     // const selectKeyboard =    new Keyboard().text('Расчитать вес')
//     //                                     .text('Получить Инстаграм')
//     //                                     .text('Получить программу тренировок')
//     //                                     .resized( )
//     const selectLabels = ['Расчитать вес', 'Получить Инстаграм', 'Получить программу тренировок' ]
//     const rows = selectLabels.map((label) =>
//     {
//         return [Keyboard.text(label)]
//     })
//     const selectKeyboard = Keyboard.from(rows).resized()
//     await ctx.reply('Выбери что тебе нужно', {
//         reply_markup: selectKeyboard
//     })
// })
// bot.command('share', async(ctx) =>
// {
//     const shareKeyboard = new Keyboard().requestLocation('Геолокация')
//                                         .requestContact('Контакт')
//                                         .resized()
//                                         .placeholder('Напиши чо то')
//     await ctx.reply('Чем хочешь поделиться', 
//         {
//             reply_markup: shareKeyboard
//         })
// })
// bot.hears('Получить Инстаграм', async (ctx) =>
// {
//     await ctx.reply('Щас пизды дам',
//         {
//             reply_markup: {remove_keyboard: true}
//         }
//     )
// })
// bot.command('select_level', async (ctx) =>
// {
//     const inlineKeyboard = new  InlineKeyboard()
//                                 .text('Начинающий уровень', 'junior').row()
//                                 .text('Средний уровень', 'middle').row()
//                                 .text('Максимальный уровень', 'senior')
//     await ctx.reply('Выбери свой уровень',
//         {
//             reply_markup: inlineKeyboard
//         })
// }) 
// bot.callbackQuery('junior', async (ctx) =>
// {
//     await ctx.reply('вы выбрали уровень')
// })
// bot.on(':contact', async (ctx) =>
// {
//     await ctx.reply('Окэй пупу')
// })
// bot.on('message', async(ctx) =>
// {
//     await ctx.reply('Надо подумать')
// })
// bot.on('msg', async(ctx) =>
// {
//     // await ctx.reply('Надо подумать')
//     console.log(ctx.msg)
// })


// bot.command(['say_hello', 'hello', 'sey_hay'], async (ctx) =>
// {
//     await ctx.reply('Привет Юра')
// })
// bot.command(['calculation'], async (ctx) =>
// {
//     await ctx.reply('Напиши мне свой максимальный вес')
// })
bot.command(['start'], async (ctx) =>
{
    await ctx.reply('Привет я Бот', {
        reply_parameters: {message_id: ctx.msg.message_id}
    })
})

const menuKeyboard = new InlineKeyboard().text('Получить консультацию', 'get')
                                        .text('Поддержка', 'support')
const backKeyboard = new InlineKeyboard().text('< Назад в меню', 'back')

bot.command('menu', async (ctx) =>
{
    await ctx.reply('Выберите пункт меню',
        {
            reply_markup: menuKeyboard,
        }
    )
})
bot.callbackQuery('get', async (ctx) =>
{
    await ctx.callbackQuery.message.editText('Щас пизды получишь',
        {
            reply_markup: backKeyboard
        })
    await ctx.answerCallbackQuery()
})
bot.callbackQuery('back', async(ctx) =>
{
    await ctx.callbackQuery.message.editText('Выберите пункт меню',
        {
            reply_markup: menuKeyboard
        })
    await ctx.answerCallbackQuery()
})
bot.catch((err) =>
{
    const  ctx = err.ctx;
    console.error(`Error while hadnling ${ctx.update.update_id}:`);
    const e = err.error;

    if(e instanceof GrammyError)
    {
        console.error('Error in request:', e.description)
    }
    else if(e instanceof HttpError)
    {
        console.error('Could not contact Telegram', e)
    }
    else 
    {
        console.error('Unknown error', e);
    }
})
bot.start();