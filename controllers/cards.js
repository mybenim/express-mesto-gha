const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const ServerError = require('../errors/ServerError');

module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(new ServerError('На сервере произошла ошибка'));
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({}) // все карточки
    .populate('express-rate-limit')
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        res.status(NotFound).send({ message: 'Карточка не найдена.' });
        return;
      }
      if (!card.owner.equals(req.user._id)) {
        next(new ServerError('На сервере произошла ошибка'));
      }
      res.send({ message: 'Карточка успешно удалена' });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      return next(error);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NotFound).send({ message: 'Карточка не найдена.' });
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные для постановки лайка'));
      }
      next(new ServerError('На сервере произошла ошибка'));
      return next(error);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NotFound).send({ message: 'Карточка не найдена.' });
        return;
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные для постановки лайка'));
      }
      next(new ServerError('На сервере произошла ошибка'));
      return next(error);
    });
};
