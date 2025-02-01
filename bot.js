require('dotenv').config();
const {Bot, GrammyError, HttpError, Keyboard, InlineKeyboard, session } = require('grammy')
const {hydrate} = require('@grammyjs/hydrate')
const { conversations, createConversation } = require ('@grammyjs/conversations')
const { FileAdapter } = require('@grammyjs/storage-file');
const { Menu } = require ("@grammyjs/menu");

// Инициализация бота
const bot = new Bot(process.env.BOT_API_KEY)

const storage = new FileAdapter({
        dir: 'sessions', // Папка для хранения сессий
    serialize: (data) => {
        console.log('Сохранение сессии:', data);
        return JSON.stringify(data);
    },
    deserialize: (data) => {
        const parsed = JSON.parse(data);
        console.log('Загрузка сессии:', parsed);
        return parsed;
    },
});

bot.use(session({ 
    initial:() => ({   }),
    storage: storage, 
}));
bot.use(hydrate())
bot.use(conversations());
bot.use(createConversation(greeting));

bot.api.setMyCommands([
    {
        command: 'start', 
        description: 'Запустить бота',
    },
    // {
    //     command: 'share',
    //     description: 'Поделиться данными'
    // },
    // {
    //     command: 'calculation',
    //     description: 'Расчитать вес'
    // },
    // {
    //     command: 'select',
    //     description: 'Выбрать'
    // },
    // {
    //     command: 'select_level',
    //     description: 'Выбрать уровень'
    // },
    // {
    //     command: 'menu',
    //     description: 'Получить меню'
    // },
    {
        command: 'welcome',
        description: 'Добро пожаловать'
    }

]);



bot.command('start', async(ctx) =>
{
    await ctx.reply('Привет я Бот')
})


bot.command('select_level', async (ctx) =>
{
    const inlineKeyboard = new  InlineKeyboard()
                                .text('Начинающий уровень', 'junior').row()
                                .text('Средний уровень', 'middle').row()
                                .text('Максимальный уровень', 'senior')
    await ctx.reply('Выбери свой уровень',
        {
            reply_markup: inlineKeyboard
        })
}) 
const userMessageHistory = {};
const welcomeKeyboard = new InlineKeyboard()
                            .text('Получить консультацию')
                            .text('Калькуляторо веса', 'calculator').row()
                            .text('Тренировки')
                            .text('Питание', 'nutrition')
const exerciseSlection = new InlineKeyboard()
                            .text('Жим лёжа', 'bench_press')                                                        
                            .text('Присед').row()                                                        
                            .text('Тяга к поясу')
                            .text('Становая тяга').row()
                            .text('<  Назад в меню', 'back-welcome-menu')         

bot.command('welcome', async (ctx) =>
{   
    await ctx.reply(`*Добро\ пожаловать*    _${ctx.from.first_name}_`, 
    {
        parse_mode: "MarkdownV2",
        reply_markup:  welcomeKeyboard        
    })
})

bot.callbackQuery('calculator', async (ctx) =>
{
    await ctx.callbackQuery.message.editText('Выбери упражнение',
        {
            reply_markup: exerciseSlection,
        })
    await ctx.answerCallbackQuery()
})
bot.callbackQuery('back-welcome-menu', async (ctx) =>
{
    await ctx.editMessageReplyMarkup({reply_markup: welcomeKeyboard})
})
let userStates = {}; // Хранилище состояний пользователей


bot.callbackQuery('bench_press', async(ctx) =>
{
    const backKeyboard = new InlineKeyboard().text('<  Назад в меню', 'back-exercise')
                                        
    const userId = ctx.callbackQuery.from.id;
    // userStates[userId] = 'awaiting_bench_press_weight';
    ctx.session.state = 'awaiting_bench_press_weight';
    console.log(userStates)
    await ctx.callbackQuery.message.editText('Пришли мне свой максимальный вес',
        {
            reply_markup: backKeyboard
        })
    await ctx.answerCallbackQuery()
})

bot.callbackQuery('back-exercise', async(ctx) =>
{
    await ctx.callbackQuery.message.editText('Выбери упражнение',
        {
            reply_markup: exerciseSlection
        })
    await ctx.answerCallbackQuery()
})
bot.callbackQuery('nutrition', async(ctx) =>
{
    await ctx.conversation.enter("greeting");
    await ctx.callbackQuery.message.editText('Пришли мне свой вес (кг)');
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


const backKeyboard2 = new InlineKeyboard().text('<  Назад в меню', 'back-exercise-selcect')


bot.use(async (ctx, next) =>
{

    await ctx.session
    console.log('Сессия в middleware:', ctx.session); 
    const userId = ctx.message?.from?.id || ctx.callbackQuery?.from?.id;

    if(!userId) return

    // const state = userStates[userId]

    const state = ctx.session.state

    if(ctx.message)
    {
        switch(state)
        {
            case 'awaiting_nutrition':
                await handleNutrition(ctx)
                break
            case 'awaiting_bench_press_weight':
                await benchPress(ctx)
                break
            case 'age':
                await changeData(ctx)
                break
        }
        // ctx.session.state = null
    }
    await next();
})



bot.callbackQuery('back-exercise-selcect', async (ctx) => 
{
    const backKeyboard = new InlineKeyboard().text('<  Назад в меню', 'back-exercise')
    const chatId = ctx.chat.id;

        if (userMessageHistory[chatId]) 
        {
            for (const messageId of userMessageHistory[chatId]) 
            {
                try 
                {
                    await ctx.api.deleteMessage(chatId, messageId);
                } 
                catch (error) 
                {
                    console.error(`Не удалось удалить сообщение ${messageId}:`, error);
                }
            }
            userMessageHistory[chatId] = [];
        }
    await ctx.reply('Пришли мне свой максимальный вес',
        {
             reply_markup: backKeyboard
        })
});

async function handleNutrition(ctx)
{
    let chatId = ctx.chat.id;
    // const messageIdToDelete = ctx.message.editReplyMarkup;
    const weight = parseFloat(ctx.message.text);
    if(!isNaN(weight))
    {
       ctx.session.weight = weight
            for (const messageId of userMessageHistory[chatId]) 
            {
                try 
                {
                    await ctx.api.deleteMessage(chatId, messageId);
                } 
                catch (error) 
                {
                    console.error(`Не удалось удалить сообщение ${messageId}:`, error);
                }
            }
            userMessageHistory[chatId] = [];        
    }
    else 
    {
         await ctx.reply('Пожалуйста, отправьте корректное значение для питания.');
    }
}
async function benchPress(ctx) 
{
    const weight = parseFloat(ctx.message.text);
    let chatId = ctx.chat.id;

    if(!isNaN(weight))
    {
        const VolumeDay = 
        {
            first: Math.floor((weight * 0.2) / 2.5) * 2.5,
            second: Math.floor((weight * 0.4) / 2.5) * 2.5,
            third: Math.floor((weight * 0.6) / 2.5) * 2.5,
            fourth: Math.floor((weight * 0.7) / 2.5) * 2.5,
            fifth: Math.floor((weight * 0.85) / 2.5) * 2.5,
            sixth: Math.floor((weight * 0.75) / 2.5) * 2.5,
        }        
        const strengthDay = 
        {
            first: Math.floor((weight * 0.2) / 2.5) * 2.5,
            second: Math.floor((weight * 0.4) / 2.5) * 2.5,
            third: Math.floor((weight * 0.6) / 2.5) * 2.5,
            fourth: Math.floor((weight * 0.7) / 2.5) * 2.5,
            fifth: Math.floor((weight * 0.8) / 2.5) * 2.5,
            sixth: Math.floor((weight * 0.9) / 2.5) * 2.5,
            seventh: Math.floor((weight * 0.8) / 2.5) * 2.5,
        }
        const subMaxDay = 
        {
            first: Math.floor((weight * 0.2) / 2.5) * 2.5,
            second: Math.floor((weight * 0.4) / 2.5) * 2.5,
            third: Math.floor((weight * 0.6) / 2.5) * 2.5,
            fourth: Math.floor((weight * 0.7) / 2.5) * 2.5,
            fifth: Math.floor((weight * 0.8) / 2.5) * 2.5,
            sixth: Math.floor((weight * 0.9) / 2.5) * 2.5,
            seventh: Math.floor((weight * 0.95) / 2.5) * 2.5,
            eighth: Math.floor((weight * 0.8) / 2.5) * 2.5
        }
        const tableVolumeDay = 
        [
            ["%", "Вес", "Подходы", "Повторения"],
            ["20%", `${VolumeDay.first}кг`, "1", "12"],
            ["40%", `${VolumeDay.second}кг`, "1", "10"],
            ["60%", `${VolumeDay.third}кг`, "1", "8"],
            ["70%", `${VolumeDay.fourth}кг`, "1", "6"],
            ["85%", `${VolumeDay.fifth}кг`, "4", "5"],
            ["75%", `${VolumeDay.sixth}кг`, "1", "8"],
        ];  
        const tableStrengthDay = 
        [
            ["%", "Вес", "Подходы", "Повторения"],
            ["20%", `${strengthDay.first}кг`, "1", "12"],
            ["40%", `${strengthDay.second}кг`, "1", "10"],
            ["60%", `${strengthDay.third}кг`, "1", "8"],
            ["70%", `${strengthDay.fourth}кг`, "1", "4"],
            ["80%", `${strengthDay.fifth}кг`, "1", "3"],
            ["90%", `${strengthDay.sixth}кг`, "3", "3"],
            ["80%", `${strengthDay.seventh}кг`, "1", "6"],
        ];
        const tablesubMaxDay = 
        [
            ["%", "Вес", "Подходы", "Повторения"],
            ["20%", `${subMaxDay.first}кг`, "1", "12"],
            ["40%", `${subMaxDay.second}кг`, "1", "10"],
            ["60%", `${subMaxDay.third}кг`, "1", "8"],
            ["70%", `${subMaxDay.fourth}кг`, "1", "4"],
            ["80%", `${subMaxDay.fifth}кг`, "1", "3"],
            ["90%", `${subMaxDay.sixth}кг`, "2", "1"],
            ["95%", `${subMaxDay.seventh}кг`, "2", "2"],
            ["80%", `${subMaxDay.eighth}кг`, "1", "6"],
        ];                  
        let tableStringVolumeDay = ""
        let tableStringStrengthDay = ""
        let tableStringSubMaxDay = ""
        tableVolumeDay.forEach(row =>
        {
            tableStringVolumeDay += row.map(cell => cell.padEnd(12)).join("")
            tableStringVolumeDay += '\n'
        })
        tableStrengthDay.forEach(row =>
        {
            tableStringStrengthDay += row.map(cell => cell.padEnd(12)).join("")
            tableStringStrengthDay += '\n'
        })
        tablesubMaxDay.forEach(row =>
        {
            tableStringSubMaxDay += row.map(cell => cell.padEnd(12)).join("")
            tableStringSubMaxDay += '\n'
        })
        userMessageHistory[chatId] = [];
        const volumeDayMessage = await ctx.reply(`Объёмный день  <pre>${tableStringVolumeDay}</pre>`, {parse_mode: 'HTML'})        
        userMessageHistory[chatId].push(volumeDayMessage.message_id)
        const strengthDayawaitMessage = await ctx.reply(`Силовой день <pre>${tableStringStrengthDay}</pre>`, {parse_mode: 'HTML'}) 
        userMessageHistory[chatId].push(strengthDayawaitMessage.message_id)       
        const subMaxDayawaitMessage = await ctx.reply(`Субмакс день <pre>${tableStringSubMaxDay}</pre>`,
            {
                reply_markup: backKeyboard2,
                parse_mode: 'HTML'
            })     
        userMessageHistory[chatId].push(subMaxDayawaitMessage.message_id)  
    }
    else 
    {
        await ctx.reply('Пожалуйста, пришли число',
            {
                reply_markup: backKeyboard
            })          
    }
}


async function greeting(conversation, ctx) 
{
    const selectKeyboard = new  InlineKeyboard()
                                .text('Да', 'select-yes')
                                .text("Нет", 'select-no')
    // await conversation.run(hydrate())
    const weight = (await conversation.waitFor(":text")).msg.text
    
    await ctx.reply('Пришли мне свой рост (см)');
    const height = (await conversation.waitFor(":text")).msg.text
    
    await ctx.reply('Пришли мне свой возраст:');
    const age = (await conversation.waitFor(":text")).msg.text

    await ctx.reply('Укажите свой пол: (мужчина/женщина)');
    const gender = (await conversation.waitFor(":text")).msg.text

    await ctx.reply('Уровень активности (коэффициент)');
    const activityLevel = (await conversation.waitFor(":text")).msg.text

    const formData = {weight, height, age, gender, activityLevel}
    
    conversation.session.weight = weight
    conversation.session.height = height;
    conversation.session.age = age;
    conversation.session.gender = gender;
    conversation.session.activityLevel = activityLevel;  

    await ctx.reply(`<b>Данные Указаны Верно ?</b>\n\nВаши данные:\nВес: ${formData.weight}кг\nРост: ${formData.height}см\nВозраст: ${formData.age}лет\nПол: ${formData.gender}\nАктивность: ${formData.activityLevel}%`,
        {
            parse_mode: 'HTML',
            reply_markup: selectKeyboard
        })

}

const formDataKeyboard = new InlineKeyboard()
                                .text('Вес','const-weight')
                                .text('Рост','const-height')
                                .text('Возраст','const-age').row()
                                .text('Пол','const-gender')
                                .text('Активность','const-activity')
                                
bot.on('callback_query:data', async (ctx) =>
{
    await ctx.session
    console.log('Сессия в callback_query:', ctx.session); // Логируем сессию
    if (ctx.callbackQuery.data === 'select-no')
    {
         await ctx.callbackQuery.message.editText('Выберите что нужно изменить',
            {
                reply_markup: formDataKeyboard
            })
        await ctx.answerCallbackQuery()
        return
    }
    if(ctx.callbackQuery.data === 'const-age')
    {
        const userId = ctx.callbackQuery.from.id;
        // userStates[userId] = 'age';
        ctx.session.state = 'age'
        await ctx.callbackQuery.message.editText('Напиши мне свой возраст')
        await ctx.answerCallbackQuery()

    }
})
async function changeData(ctx)
{
    await ctx.session
    const newAge = ctx.msg.text;
    ctx.session.age = newAge;
}
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