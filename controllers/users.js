/* eslint-disable no-unused-vars */
const User = require('../models/user');

exports.getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Internal Server Error' });
    });
};

exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(500).json({ message: 'User not found' });
      }
      return res.json(user);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Internal Server Error' });
    });
};

exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Internal Server Error' });
    });
};
