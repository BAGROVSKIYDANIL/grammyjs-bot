const { InlineKeyboard } = require('grammy')

const formDataKeyboard = new InlineKeyboard()
                                .text('Вес','const-weight')
                                .text('Рост','const-height')
                                .text('Возраст','const-age').row()
                                .text('Пол','const-gender')
                                .text('Активность','const-activity')
module.exports = {formDataKeyboard}                                
