const { InlineKeyboard } = require('grammy')

const exerciseSlection = new InlineKeyboard()
                        .text('Жим лёжа', 'bench_press')                                                        
                        .text('Присед').row()                                                        
                        .text('Тяга к поясу')
                        .text('Становая тяга').row()
                        .text('<  Назад в меню', 'back-welcome-menu')  

module.exports = {exerciseSlection}