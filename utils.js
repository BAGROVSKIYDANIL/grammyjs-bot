const userMessageHistory = {};
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

module.exports = {benchPress, userMessageHistory};