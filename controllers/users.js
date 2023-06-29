const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  UNAUTHORIZED,
} = require('../constants/errorStatuses');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).orFail();
    return res.json(user);
  } catch (error) {
    return next(error);
  }
};

exports.createUser = async (req, res, next) => {
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
    return next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
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
    return next(error);
  }
};

exports.updateAvatar = async (req, res, next) => {
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
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res
        .status(UNAUTHORIZED)
        .json({ message: 'Неправильные почта или пароль' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(UNAUTHORIZED)
        .json({ message: 'Неправильные почта или пароль' });
    }

    const token = jwt.sign({ _id: user._id }, 'super-secret-key', {
      expiresIn: '7d',
    });

    return res
      .cookie('token', token, { httpOnly: true, secure: true, sameSite: true })
      .json({ token });
  } catch (error) {
    return next(error);
  }
};

exports.getUserInfo = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const user = await User.findById(_id);
    return res.json(user);
  } catch (error) {
    return next(error);
  }
};
