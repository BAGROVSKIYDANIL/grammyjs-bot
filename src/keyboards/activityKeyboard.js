const { InlineKeyboard } = require('grammy')

const activityKeyboard = new InlineKeyboard()
.text(`🤒 Минимальная активность`, 'minimal-activity')
.text('🤧 Лёгкая активность ', 'light-activity').row()
.text('😮 Средняя активность', 'medium-activity')
.text('👹 Высокая активность', 'high-activity')

module.exports = {activityKeyboard}