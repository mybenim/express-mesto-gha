const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const ServerError = require('../errors/ServerError');

module.exports.getUsers = (req, res, next) => {
  User.find({}) // найти всех
    .then((users) => res.send({ users }))
    .catch(next);
};

module.exports.addUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest({ message: 'Переданы некорректные данные.' }));
      } else {
        next(new ServerError({ message: 'На сервере произошла ошибка.' }));
      }
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NotFound).send({ message: 'Пользователь не найден.' });
      }
      res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest({ message: 'Переданы некорректные данные.' }));
        //res.status(BadRequest).send({ message:'Переданы некорректные данные' })
      } else {
        //res.status(ServerError).send({ message:'На сервере произошла ошибка' })
        next(new ServerError({ message: 'На сервере произошла ошибка.' }));
      }
    });
};

module.exports.editUserData = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFound({ message: 'Пользователь не найден' }));
      }
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(new BadRequest({ message: 'Переданы некорректные данные при обновлении профиля.' }));
      } else {
        next(new ServerError({ message: 'На сервере произошла ошибка' }));
      }
    });
};

module.exports.editUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(new BadRequest({ message: 'Переданы некорректные данные при обновлении фото.' }));
      } else {
        next(new ServerError({ message: 'На сервере произошла ошибка' }));
      }
    });
};
