const { InlineKeyboard } = require('grammy')

const selectGengerKeyboard = new InlineKeyboard()
.text('Мужчина', 'male')
.text('Женщина', 'female')

module.exports = {selectGengerKeyboard}