const User = require('../models/user');

const BadRequestError = 400;
const NotFoundError = 404;
const ServerError = 500;

module.exports.getUsers = (req, res) => {
  User.find({}) // найти всех
    .then((users) => res.send({ users }))
    .catch(() => res.status(ServerError).send({ message: 'На сервере произошла ошибка.' }));
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BadRequestError).json({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(ServerError).json({ message: 'На сервере произошла ошибка.' });
      }
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NotFoundError).json({ message: 'Пользователь не найден.' });
      }
      res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BadRequestError).json({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(ServerError).json({ message: 'На сервере произошла ошибка.' });
      }
    });
};

module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(NotFoundError).json({ message: 'Пользователь не найден.' });
      }
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        res.status(BadRequestError).json({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(ServerError).json({ message: 'На сервере произошла ошибка.' });
      }
    });
};

module.exports.editUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        res.status(BadRequestError).send({ message: 'Переданы некорректные данные при обновлении фото.' });
      } else {
        res.status(ServerError).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};
