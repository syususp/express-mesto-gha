const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  SERVER_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
  UNAUTHORIZED,
} = require('../constants/errorStatuses');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(SERVER_ERROR).json({ message: 'Ошибка сервера' });
  }
};

exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).orFail();
    return res.json(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'Ошибка ID пользователя' });
    }

    if (error instanceof mongoose.Error.DocumentNotFoundError) {
      return res.status(NOT_FOUND).json({ message: 'Пользователь не найден' });
    }

    return res.status(SERVER_ERROR).json({ message: 'Ошибка сервера' });
  }
};

exports.createUser = async (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });
    return res.json(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST).json({ message: 'Ошибка валидации' });
    }
    return res.status(SERVER_ERROR).json({ message: 'Ошибка сервера' });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    return res.json(updatedUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST).json({ message: 'Ошибка валидации' });
    }
    return res.status(SERVER_ERROR).json({ message: 'Ошибка сервера' });
  }
};

exports.updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    return res.json(updatedUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST).json({ message: 'Ошибка валидации' });
    }
    return res.status(SERVER_ERROR).json({ message: 'Ошибка сервера' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(UNAUTHORIZED).json({ message: 'Неправильные почта или пароль' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(UNAUTHORIZED).json({ message: 'Неправильные почта или пароль' });
    }

    const token = jwt.sign({ _id: user._id }, 'your-secret-key', { expiresIn: '7d' });

    return res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' }).json({ token });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: 'Ошибка сервера' });
  }
};
