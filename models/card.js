const mongoose = require('mongoose');
const urlRegex = require('../utils/constants');

const cardSchema = new mongoose.Schema({
  name: {
    type: String, // строка
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля два символа'],
    maxlength: [30, 'Максимальная длина поля тридцать символов'],
  },
  link: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator(v) { // validator - функция проверки данных. v - https
        return urlRegex.test(v);
      },
      message: 'Введите URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
