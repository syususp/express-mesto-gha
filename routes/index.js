const express = require('express');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const requestValidation = require('../middlewares/requestValidation');

const router = express.Router();

router.use('/users', requestValidation, userRoutes);
router.use('/cards', requestValidation, cardRoutes);

module.exports = router;
