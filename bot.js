require('dotenv').config();
const {Bot, GrammyError, HttpError, Keyboard, InlineKeyboard, session } = require('grammy')
const {startHandler} = require('./src/handlers/start')
const {welcomeKeyboard} = require('./src/keyboards/welcomeKeyboard')
const {exerciseSlection} = require('./src/keyboards/exerciseKeyboard')
const {activityKeyboard} = require('./src/keyboards/activityKeyboard')
const {selectGengerKeyboard} = require('./src/keyboards/genderKeyboard')
const {selectKeyboard} = require('./src/keyboards/confirmKeyboard')
const {formDataKeyboard} = require('./src/keyboards/changeValueKeyboard')
const {calculateCalories} = require('./src/utils/calculateCalories')
const {sessionMiddleware } = require('./src/middlewares/sessionMiddleware')
const {hydrate} = require('@grammyjs/hydrate')
const { conversations, createConversation } = require ('@grammyjs/conversations')
const { FileAdapter } = require('@grammyjs/storage-file');
const { Menu } = require ("@grammyjs/menu");

// Инициализация бота
const bot = new Bot(process.env.BOT_API_KEY)
bot.use(sessionMiddleware);

bot.command('start', startHandler);
bot.use(hydrate())
bot.use(conversations());
bot.use(createConversation(greeting, { plugins: [hydrate()] }));


let userMessageHistory = {};

       


// bot.callbackQuery('calculator', async (ctx) =>
// {
//     await ctx.callbackQuery.message.editText('Выбери упражнение',
//         {
//             reply_markup: exerciseSlection,
//         })
//     await ctx.answerCallbackQuery()
// })
// bot.callbackQuery('back-welcome-menu', async (ctx) =>
// {
//     await ctx.editMessageReplyMarkup({reply_markup: welcomeKeyboard})
// })
let userStates = {}; // Хранилище состояний пользователей


bot.callbackQuery('bench_press', async(ctx) =>
{
    const backKeyboard = new InlineKeyboard().text('<  Назад в меню', 'back-exercise')
    ctx.session.state = 'awaiting_bench_press_weight';

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



const backKeyboard = new InlineKeyboard().text('< Назад в меню test', 'back')


const backKeyboard2 = new InlineKeyboard().text('<  Назад в меню', 'back-exercise-selcect')


bot.use(async (ctx, next) =>
{

    await ctx.session
    console.log('Сессия в middleware:', ctx.session); 
    const userId = ctx.message?.from?.id || ctx.callbackQuery?.from?.id;

    if(!userId) return

    const state = ctx.session?.state
    if(ctx.message)
    {
        switch(state)
        {
            case 'awaiting_bench_press_weight':
                await benchPress(ctx)
                break
            case 'age':
                await changeData(ctx)
                break
            case 'weight':
                await changeWeight(ctx)
                break
            case 'height':
                await changeHeight(ctx)
                break
            case 'activity':
                await changeActivity(ctx)
                break
            case 'gender':
                await changeGender(ctx)
                break
        }
        // ctx.session.state = null 
    }
    await next();
})






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


    // userMessageHistory[chatId] = [];
        // ctx.session.userMessage = {chatId}
        // const userMessageHistory = ctx.session.userMessage
        let userMessageHistory = {}
        userMessageHistory[chatId] = [];
            // console.log('ARRAY2',userMessageHistory)

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
        ctx.session.userMesage = userMessageHistory
        console.log('MESSAGE USER',userMessageHistory)
    }
    else 
    {
        await ctx.reply('Пожалуйста, пришли число',
            {
                reply_markup: backKeyboard
            })          
    }
}
bot.callbackQuery('back-exercise-selcect', async (ctx) => 
{
    await ctx.session
    const backKeyboard = new InlineKeyboard().text('<  Назад в меню', 'back-exercise')
    const chatId = ctx.chat.id;
    const userMessageHistory = ctx.session.userMesage

    console.log('**',userMessageHistory)
        if (userMessageHistory[chatId]) 
        {
            console.log('worj')
            for (const messageId of userMessageHistory[chatId]) 
            {
                try 
                {
                    console.log('ID',messageId)
                    await ctx.api.deleteMessage(chatId, messageId);
                    // ctx.session.userMesage = null
                    delete ctx.session.userMesage
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
async function greeting(conversation, ctx) 
{
    const weight = (await conversation.waitFor(":text")).msg.text

    await ctx.reply('Пришли мне свой рост (см)');
    const height = (await conversation.waitFor(":text")).msg.text
    
    await ctx.reply('Пришли мне свой возраст');
    const age = (await conversation.waitFor(":text")).msg.text

    await ctx.reply('Укажите свой пол:',
        {
            reply_markup: selectGengerKeyboard
        });
    const genderCallback = await conversation.waitFor('callback_query')

    await ctx.api.answerCallbackQuery(genderCallback.update.callback_query.id); // Убираем индикатор загрузки

    const gender = genderCallback.callbackQuery.data === 'male' ? 'Мужчина' : 'Женщина';

    await ctx.reply(
        'Укажите свой уровень активности:\n\n'+
        '<b>🤒 Минимальная активность</b>(сидячий образ жизни)\n\n'+
        '<b>🤧 Лёгкая активность </b>(легкие тренировки 1-3 раза в неделю)\n\n'+
        '<b>😮 Средняя активность </b>(тренировки 3-5 раз в неделю\n\n'+
        '<b>👹 Высокая активность </b>(интенсивные тренировки 6-7 раз в неделю)',
        {
            parse_mode: 'HTML',
            reply_markup: activityKeyboard
        }
    );
    const activityCallback = await conversation.waitFor('callback_query')

    await ctx.api.answerCallbackQuery(activityCallback.update.callback_query.id); // Убираем индикатор загрузки

    // const activityLevel = (await conversation.waitFor(":text")).msg.text
    let activityLevel
    let activityValue
    switch( activityCallback.callbackQuery.data)
    {
        case 'minimal-activity':
            activityLevel = 'Минимальная активность';
            activityValue = 1.2
            break
        case 'light-activity':
            activityLevel = 'Лёгкая активность';
            activityValue = 1.375
            break        
        case 'medium-activity':
            activityLevel = 'Средняя активность';
            activityValue = 1.55
            break            
        case 'high-activity':
            activityLevel = 'Высокая активность';
            activityValue = 1.725
            break            
    }

    const formData = {weight, height, age, gender, activityLevel, activityValue}
    
    conversation.session.weight = weight
    conversation.session.height = height;
    conversation.session.age = age;
    conversation.session.gender = gender 
    conversation.session.activityLevel = activityLevel;  
    conversation.session.activityValue = activityValue;  

    await ctx.reply(
        `<b>Данные Указаны Верно ?</b>\n\n`+
        `Ваши данные:\nВес: ${formData.weight}кг\n`+
        `Рост: ${formData.height}см\n`+
        `Возраст: ${formData.age}лет\n`+
        `Пол: ${formData.gender}\n`+
        `Активность: ${formData.activityLevel}`,
        {
            parse_mode: 'HTML',
            reply_markup: selectKeyboard
        })

}

// Обработчик для изменения данных
async function handleDataChange(ctx, field, message) {
    ctx.session.state = field;
    await ctx.callbackQuery.message.editText(message);
    await ctx.answerCallbackQuery();
}
// Обработчик для изменения уровня активности
async function handleActivityChange(ctx) {
    await ctx.answerCallbackQuery();
    ctx.session.state = 'activity';
    await changeActivity(ctx);
}

// Обработчик для изменения пола
async function handleGenderChange(ctx) {
    await ctx.callbackQuery.message.editText('Укажите свой пол:', {
        reply_markup: selectGengerKeyboard,
    });
    await ctx.answerCallbackQuery();
}

// Обработчик для подтверждения данных и расчета калорий
async function handlerConfirmation(ctx)
{
    const { gender, weight, height, age, activityLevel } = ctx.session;

    if (gender && weight && height && age && activityLevel)
    {
        const totalCalories = calculateCalories({ weight, height, age, gender, activityLevel });
        await ctx.callbackQuery.message.editText(`Расчёт калорий: ${totalCalories} ккал/день`);

    }
}
                                

bot.on('callback_query:data', async (ctx) => {
    const callBackData = ctx.callbackQuery.data;

    const handlers = {
        'select-no': async () => {
            await ctx.callbackQuery.message.editText('Выберите что нужно изменить', {
                        reply_markup: formDataKeyboard
            });
            await ctx.answerCallbackQuery()
        },
        'calculator': async (ctx) =>
        {
            await ctx.callbackQuery.message.editText('Выбери упражнение',
            {
                reply_markup: exerciseSlection,
            })
            await ctx.answerCallbackQuery()
        },
        'back-welcome-menu': async(ctx) =>
        {
            await ctx.editMessageReplyMarkup({reply_markup: welcomeKeyboard})
        },
        'select-yes': handlerConfirmation,
        'const-age': () => handleDataChange(ctx, 'age', 'Напиши мне свой возраст'),
        'const-weight': () => handleDataChange(ctx, 'weight', 'Напиши мне свой вес'),
        'const-height': () => handleDataChange(ctx, 'height', 'Напиши мне свой рост'),
        'const-activity': () => handleDataChange(ctx, 'activity', 'Укажите свой уровень активности:'),
        'minimal-activity': handleActivityChange,
        'light-activity': handleActivityChange,
        'medium-activity': handleActivityChange,
        'high-activity': handleActivityChange,
        'const-gender': handleGenderChange,
        'male': () => handleDataChange(ctx, 'gender', 'Укажите свой пол:'),
        'female': () => handleDataChange(ctx, 'gender', 'Укажите свой пол:'),
    }

    if(handlers[callBackData])
    {
        await handlers[callBackData](ctx)
    }
})
async function changeWeight(ctx)
{
    await ctx.session
    const newWeight = ctx.msg.text;
    ctx.session.weight = newWeight

    const formData = await ctx.session
    await ctx.reply(
        `<b>Данные Указаны Верно ?</b>\n\n`+
        `Ваши данные:\n`+
        `Вес: ${formData.weight}кг\n`+
        `Рост: ${formData.height}см\n`+
        `Возраст: ${formData.age}лет\n`+
        `Пол: ${formData.gender}\n`+
        `Активность: ${formData.activityLevel}`,
    {
        parse_mode: 'HTML',
        reply_markup: selectKeyboard
    })
}
async function changeHeight(ctx)
{
    await ctx.session
    const newHeight = ctx.msg.text;
    ctx.session.height = newHeight
    const formData = await ctx.session
    await ctx.reply(
        `<b>Данные Указаны Верно ?</b>\n\n`+
        `Ваши данные:\n`+
        `Вес: ${formData.weight}кг\n`+
        `Рост: ${formData.height}см\n`+
        `Возраст: ${formData.age}лет\n`+
        `Пол: ${formData.gender}\n`+
        `Активность: ${formData.activityLevel}`,
    {
        parse_mode: 'HTML',
        reply_markup: selectKeyboard
    })
}
async function changeData(ctx)
{
    await ctx.session
    const newAge = ctx.msg.text;
    ctx.session.age = newAge;
    const formData = await ctx.session
    await ctx.reply(
        `<b>Данные Указаны Верно ?</b>\n\n`+
        `Ваши данные:\n`+
        `Вес: ${formData.weight}кг\n`+
        `Рост: ${formData.height}см\n`+
        `Возраст: ${formData.age}лет\n`+
        `Пол: ${formData.gender}\n`+
        `Активность: ${formData.activityLevel}`,
    {
        parse_mode: 'HTML',
        reply_markup: selectKeyboard
    })
}
async function changeGender(ctx)
{
    await ctx.session
    const newGender = ctx.callbackQuery.data === 'male' ? 'Мужчина' : 'Женщина';
    ctx.session.gender = newGender

    const formData = await ctx.session
    await ctx.callbackQuery.message.editText(
        `<b>Данные Указаны Верно ?</b>\n\n`+
        `Ваши данные:\n`+
        `Вес: ${formData.weight}кг\n`+
        `Рост: ${formData.height}см\n`+
        `Возраст: ${formData.age}лет\n`+
        `Пол: ${formData.gender}\n`+
        `Активность: ${formData.activityLevel}%`,
    {
        parse_mode: 'HTML',
        reply_markup: selectKeyboard
    })

}
async function changeActivity(ctx)
{
    await ctx.session
    let activityLevel;
    let activityValue
    switch( ctx.callbackQuery.data)
    {
        case 'minimal-activity':
            activityLevel = 'Минимальная активность';
            activityValue = 1.2
            break
        case 'light-activity':
            activityLevel = 'Лёгкая активность';
            activityValue = 1.375
            break        
        case 'medium-activity':
            activityLevel = 'Средняя активность';
            activityValue = 1.55
            break            
        case 'high-activity':
            activityLevel = 'Высокая активность';
            activityValue = 1.725
            break            
    }
    const newActivity = activityLevel;
    ctx.session.activityLevel = newActivity
    ctx.session.activityValue = activityValue;
    const formData = await ctx.session
    await ctx.reply(
        `<b>Данные Указаны Верно ?</b>\n\n`+
        `Ваши данные:\n`+
        `Вес: ${formData.weight}кг\n`+
        `Рост: ${formData.height}см\n`+
        `Возраст: ${formData.age}лет\n`+
        `Пол: ${formData.gender}\n`+
        `Активность: ${formData.activityLevel}`,
    {
        parse_mode: 'HTML',
        reply_markup: selectKeyboard
    })
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