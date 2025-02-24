/**
 * Рассчитывает базовый уровень метаболизма (BMR) для мужчин и женщин.
 * @param {number} weight - Вес пользователя в кг.
 * @param {number} height - Рост пользователя в см.
 * @param {number} age - Возраст пользователя в годах.
 * @param {string} gender - Пол пользователя ('Мужчина' или 'Женщина').
 * @returns {number} - Базовая потребность в калориях (BMR) в ккал/день.
 */

function calculateBMR(weight, height, age, gender)
{
    if(gender === 'Мужчина')
    {
        // Формула Харриса-Бенедикта для мужчин
        const bmrPrimary = 10 * weight + 6.25 * height - 5 * age + 5;
        const bmrSecondary = 66.5 + 13.75 * weight + 5.003 * height - 6.75 * age;
        return (bmrPrimary + bmrSecondary) / 2;        
    }
    else if(gender === 'Женщина')
    {
        // Формула Харриса-Бенедикта для женщин
        const bmrPrimary = 10 * weight + 6.25 * height - 5 * age - 161;
        const bmrSecondary = 655.1 + 9.563 * weight + 1.850 * height - 4.676 * age;
        return (bmrPrimary + bmrSecondary) / 2; 
    }
    else 
    {
        throw new Error('Неверно указан пол. Допустимые значения: "Мужчина" или "Женщина".');
    }
}
/**
 * Рассчитывает общую потребность в калориях с учетом уровня активности.
 * @param {number} bmr - Базовая потребность в калориях (BMR).
 * @param {string} activityLevel - Уровень активности пользователя.
 * @returns {number} - Общая потребность в калориях в ккал/день.
 */
function calculateTotalCalories(bmr, activityLevel) 
{
    const activityMultipliers = 
    {
        'Минимальная активность': 1.2,
        'Лёгкая активность': 1.375,
        'Средняя активность': 1.55,
        'Высокая активность': 1.725,
    };

    if (!activityMultipliers[activityLevel]) 
    {
        throw new Error('Неверно указан уровень активности.');
    }

    return bmr * activityMultipliers[activityLevel];
}
/**
 * Основная функция для расчета калорий.
 * @param {object} userData - Данные пользователя.
 * @param {number} userData.weight - Вес пользователя в кг.
 * @param {number} userData.height - Рост пользователя в см.
 * @param {number} userData.age - Возраст пользователя в годах.
 * @param {string} userData.gender - Пол пользователя ('Мужчина' или 'Женщина').
 * @param {string} userData.activityLevel - Уровень активности пользователя.
 * @returns {number} - Общая потребность в калориях в ккал/день.
 */
function calculateCalories(userData) 
{
    const { weight, height, age, gender, activityLevel } = userData;

    // Рассчитываем базовый уровень метаболизма (BMR)
    const bmr = calculateBMR(weight, height, age, gender);

    // Рассчитываем общую потребность в калориях с учетом активности
    const totalCalories = calculateTotalCalories(bmr, activityLevel);

    return Math.round(totalCalories); // Округляем до целого числа
}
module.exports = {calculateCalories}