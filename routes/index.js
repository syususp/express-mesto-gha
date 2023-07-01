const express = require('express');
const userRoutes = require('./users');
const cardRoutes = require('./cards');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

module.exports = router;
