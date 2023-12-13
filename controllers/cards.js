const Card = require('../models/card');

const BadRequestError = 400;
const NotFoundError = 404;
const ServerError = 500;

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BadRequestError).send('Переданы некорректные данные при создании карточки');
      } else {
        res.status(ServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({}) // все карточки
    .populate(['owner', 'likes']) // не получилось разобраться :( , потребуется время, пока его нет. сроки!
    .then((cards) => res.send({ cards }))
    .catch(() => res.status(ServerError).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        res.status(NotFoundError).send({ message: 'Карточка не найдена.' });
        return;
      }
      if (!card.owner.equals(req.user._id)) {
        res.status(ServerError).send({ message: 'На сервере произошла ошибка' });
      }
      res.status(200).send({ message: 'Карточка успешно удалена' });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BadRequestError).send({ message: 'Переданы некорректные данные' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NotFoundError).send({ message: 'Карточка не найдена.' });
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BadRequestError).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else {
        res.status(ServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NotFoundError).send({ message: 'Карточка не найдена.' });
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BadRequestError).send('Переданы некорректные данные');
      }
      res.status(ServerError).send({ message: 'На сервере произошла ошибка' });
    });
};
