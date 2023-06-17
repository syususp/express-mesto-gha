const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  SERVER_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
  CREATED,
} = require('../constants/errorStatuses');

exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    res
      .status(SERVER_ERROR)
      .json({ message: 'Ошибка сервера' });
  }
};

exports.createCard = async (req, res) => {
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(CREATED).json(card);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'Ошибка валидации' });
    }
    return res
      .status(SERVER_ERROR)
      .json({ message: 'Ошибка сервера' });
  }
};

exports.deleteCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const deletedCard = await Card.findOneAndDelete({
      _id: cardId,
      owner: req.user._id,
    });

    if (!deletedCard) {
      return res
        .status(NOT_FOUND)
        .json({ message: 'Карточка не найдена' });
    }

    return res.json(deletedCard);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'Ошибка валидации' });
    }
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'Ошибка ID карточки' });
    }
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.likeCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true, runValidators: true },
    );

    if (!updatedCard) {
      return res
        .status(NOT_FOUND)
        .json({ message: 'Карточка не найдена' });
    }

    return res.json(updatedCard);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'Ошибка валидации' });
    }
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'Ошибка ID карточки' });
    }
    return res
      .status(SERVER_ERROR)
      .json({ message: 'Ошибка сервера' });
  }
};

exports.unlikeCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true, runValidators: true },
    );

    if (!updatedCard) {
      return res
        .status(NOT_FOUND)
        .json({ message: 'Карточка не найдена' });
    }

    return res.json(updatedCard);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'Ошибка валидации' });
    }
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'Ошибка ID карточки' });
    }
    return res
      .status(SERVER_ERROR)
      .json({ message: 'Ошибка сервера' });
  }
};
