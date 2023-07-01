const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

const router = express.Router();

router.get('/', getUsers);
router.get('/:userId', celebrate({ [Segments.PARAMS]: Joi.object({ userId: Joi.string().required() }) }), getUserById);
router.get('/me', getUserInfo);
router.patch('/me', celebrate({ [Segments.BODY]: Joi.object({ name: Joi.string().min(2).max(30), about: Joi.string() }) }), updateProfile);
router.patch('/me/avatar', celebrate({ [Segments.BODY]: Joi.object({ avatar: Joi.string().uri() }) }), updateAvatar);

module.exports = router;
