const Card = require('../models/card');
const {
  NOT_FOUND,
  CREATED,
  FORBIDDEN,
} = require('../constants/errorStatuses');

exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find();
    return res.json(cards);
  } catch (error) {
    return next(error);
  }
};

exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(CREATED).json(card);
  } catch (error) {
    return next(error);
  }
};

exports.deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(NOT_FOUND).json({ message: 'Карточка не найдена' });
    }

    if (card.owner !== _id) {
      return res.status(FORBIDDEN).json({ message: 'Нет прав на удаление карточки' });
    }

    await Card.findByIdAndDelete(cardId);

    return res.json({ message: 'Карточка удалена' });
  } catch (error) {
    return next(error);
  }
};

exports.likeCard = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!updatedCard) {
      return res.status(NOT_FOUND).json({ message: 'Карточка не найдена' });
    }

    return res.json(updatedCard);
  } catch (error) {
    return next(error);
  }
};

exports.unlikeCard = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!updatedCard) {
      return res.status(NOT_FOUND).json({ message: 'Карточка не найдена' });
    }

    return res.json(updatedCard);
  } catch (error) {
    return next(error);
  }
};
