const Card = require('../models/card');

exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.createCard = async (req, res) => {
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner: req.user._id });
    res.status(201).json(card);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request' });
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
      return res.status(404).json({ message: 'Запрашиваемая карточка не найдена' });
    }
    return res.json(deletedCard);
  } catch (error) {
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
      { new: true },
    );
    if (!updatedCard) {
      return res.status(404).json({ message: 'Запрашиваемая карточка не найдена' });
    }
    return res.json(updatedCard);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.unlikeCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );
    if (!updatedCard) {
      return res.status(404).json({ message: 'Запрашиваемая карточка не найдена' });
    }
    return res.json(updatedCard);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};
