const express = require('express');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const {
  validateUserRequest,
  validateCardRequest,
} = require('../middlewares/requestValidation');

const router = express.Router();

router.use('/users', validateUserRequest, userRoutes);
router.use('/cards', validateCardRequest, cardRoutes);

module.exports = router;
