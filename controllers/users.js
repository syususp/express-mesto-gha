const User = require('../models/user');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    return res.json(user);
  } catch (error) {
    return res.status(400).json({ message: 'Ошибка сервера' });
  }
};

exports.createUser = async (req, res) => {
  const { name, about, avatar } = req.body;

  try {
    const user = await User.create({ name, about, avatar });
    res.json(user);
  } catch (error) {
    res.status(400).json({
      message: 'Переданы некорректные данные при создании пользователя',
    });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  if (!name || name.length < 2) {
    return res.status(400).json({ message: 'Некорректное имя пользователя' });
  }

  if (name && name.length > 30) {
    return res
      .status(400)
      .json({ message: 'Слишком длинное имя пользователя' });
  }

  if (about && about.length < 2) {
    return res
      .status(400)
      .json({ message: 'Некорректная информация о пользователе' });
  }

  if (about && about.length > 30) {
    return res
      .status(400)
      .json({ message: 'Слишком длинная информация о пользователе' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true },
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.json(updatedUser);
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Переданы некорректные данные при обновлении профиля' });
  }
};

exports.updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true },
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.json(updatedUser);
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Переданы некорректные данные при обновлении аватара' });
  }
};
