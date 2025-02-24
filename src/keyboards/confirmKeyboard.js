const { InlineKeyboard } = require('grammy')
const selectKeyboard = new  InlineKeyboard()
                            .text('Да', 'select-yes')
                            .text("Нет", 'select-no')
module.exports = {selectKeyboard}                            