const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const jwtSecret = process.env.JWT_SECRET;

//generate user token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

const generatePasswordHash = async (password) => {
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
};

const validatePassword = async (password, passwordHash) => {
  return await bcrypt.compare(password, passwordHash);
};

//register user and sign in
const register = async (req, res) => {
  const { name, email, password } = req.body;

  //check if user exists
  const user = await User.findOne({ email });
  if (user) {
    res.status(422).json({ errors: ["Please use another email"] });
    return;
  }

  //Generate password hash
  const passwordHash = await generatePasswordHash(password);

  //Create user
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  //if user was created successfully, return the token
  if (!newUser) {
    res
      .status(422)
      .json({ errors: ["Sorry we have a problem here, try again later."] });
    return;
  }
  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

//Sign user in
const login = async (req, res) => {
  const { email, password } = req.body;

  //checking user
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ errors: "User not found." });
    return;
  }
  //checking the password
  if (!(await validatePassword(password, user.password))) {
    res.status(422).json({ errors: "Incorrect password" });
    return;
  }

  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};
//get current logged in user
const getCurrentUser = async (req, res) => {
  const user = req.user;
  res.status(201).json(user);
};
//update infos
const update = async (req, res) => {
  const { name, password, bio } = req.body;

  let profileImage = null;

  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;

  const user = await User.findById(mongoose.Types.ObjectId(reqUser._id)).select(
    "-password"
  );

  if (name) {
    user.name = name;
  }

  if (password) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    user.password = passwordHash;
  }

  if (profileImage) {
    user.profileImage = profileImage;
  }

  if (bio) {
    user.bio = bio;
  }

  await user.save();

  res.status(200).json(user);
};

//get user by id
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(mongoose.Types.ObjectId(id)).select(
      -"password"
    );
    res.status(201).json(user);
  } catch (error) {
    res.status(404).json({ errors: "User not found." });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
};
