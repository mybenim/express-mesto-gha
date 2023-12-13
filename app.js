const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// подключаемся к серверу mongo
mongoose.connect(DB_URL);

app.use((req, res, next) => {
  req.user = {
    _id: '6577eac0af30b949edebc3bb', // _id созданного пользователя
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Что-то пошло не так :(' });
});

app.listen(PORT);

// Не понимаю, как работают тесты, получается, тест записывает все рабочие моменты..
// Сейчас, вроде, всё работает, откуда тогда ошибки?
