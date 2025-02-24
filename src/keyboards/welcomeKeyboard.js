const { InlineKeyboard } = require('grammy')

const welcomeKeyboard = new InlineKeyboard()
                        .text('💬 Получить консультацию','support')
                        .text('📈 Оптимизация нагрузки', 'calculator').row()
                        .text('🏋️‍♂️ Тренировки')
                        .text('📊 Расчёт калорий', 'nutrition')
module.exports = {welcomeKeyboard}