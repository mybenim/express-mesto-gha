const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String, // строка
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля два символа'],
    maxlength: [30, 'Максимальная длина поля тридцать символов'],
  },
  about: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля два символа'],
    maxlength: [30, 'Максимальная длина поля тридцать символов'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator(url) { // validator - функция проверки данных. v - значение свойства url
        return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(url); // https://uibakery.io/regex-library/url
      },
      message: 'Введите URL',
    },
  },
}, { versionKey: false });

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
