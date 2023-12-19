const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const Card = require('../models/card');
// const { StatusCodes } = require('http-status-codes')
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError(error.message));
      } else {
        next(error);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({}) // все карточки
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена.'));
        return;
      }
      if (!card.owner.equals(req.user._id)) {
        // next(error);
      }
      res.status(HTTP_STATUS_OK).send({ message: 'Карточка успешно удалена.' });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError(error.message));
        // res.status(BadRequestError).send({ message: 'Переданы некорректные данные.' });
      } else {
        next(error);
        // res.status(ServerError).json({ message: 'На сервере произошла ошибка.' });
      }
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
        next(new NotFoundError('Карточка не найдена.'));
        // return res.status(NotFoundError).send({ message: 'Карточка не найдена.' });
      }
      return res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError(error.message));
      } else {
        next(error);
      }
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
        next(new NotFoundError('Карточка не найдена.'));
      }
      return res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError(error.message));
      } else {
        next(error);
      }
    });
};
