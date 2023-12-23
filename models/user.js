const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const validator = require('validator');
const UnautorizedError = require('../errors/UnautorizedError');
const urlRegex = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String, // строка
    default: 'Ваше имя',
    minlength: [2, 'Минимальная длина поля два символа'],
    maxlength: [30, 'Максимальная длина поля тридцать символов'],
  },
  about: {
    type: String,
    default: 'О себе',
    minlength: [2, 'Минимальная длина поля два символа'],
    maxlength: [30, 'Максимальная длина поля тридцать символов'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(url) { // validator - функция проверки данных. v - значение свойства url
        return urlRegex.test(url);
      },
      message: 'Введите URL',
    },
  },
  email: {
    type: String,
    required: [true, 'Поле должно быть заполнено.'],
    unique: true,
    validate: {
      validator(email) {
        // validator.isEmail(email); // не работает :(
        return /^\S+@\S+\.\S+$/.test(email); // https://uibakery.io/regex-library/email-regex-csharp
      },
      message: 'Введите email',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле должно быть заполнено.'],
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // throw new UnautorizedError('Неправильные почта или пароль');
        return Promise.reject(new UnautorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // throw new UnautorizedError('Неправильные почта или пароль');
            return Promise.reject(new UnautorizedError('Неправильные почта или пароль'));
          }
          return user; // теперь user доступен
        });
    });
};

// создаём модель и экспортируем её.
module.exports = mongoose.model('user', userSchema);
