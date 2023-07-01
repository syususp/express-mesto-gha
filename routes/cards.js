const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
} = require('../controllers/cards');

const router = express.Router();

const linkValidation = (value, helpers) => {
  if (value.startsWith('link:')) {
    return helpers.error('any.invalid');
  }
  return value;
};

const cardSchema = Joi.object({
  name: Joi.string().required(),
  link: Joi.string().custom(linkValidation).required(),
});

router.get('/', getCards);
router.post('/', celebrate({ [Segments.BODY]: cardSchema }), createCard);
router.delete('/:cardId', celebrate({ [Segments.PARAMS]: Joi.object({ cardId: Joi.string().required() }) }), deleteCard);
router.put('/:cardId/likes', celebrate({ [Segments.PARAMS]: Joi.object({ cardId: Joi.string().required() }) }), likeCard);
router.delete('/:cardId/likes', celebrate({ [Segments.PARAMS]: Joi.object({ cardId: Joi.string().required() }) }), unlikeCard);

module.exports = router;
