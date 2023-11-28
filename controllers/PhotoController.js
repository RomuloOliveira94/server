const Photo = require("../models/Photo");
const mongoose = require("mongoose");
const User = require("../models/User");
const Comment = require("../models/Comment");

//insert a photo, with an user related
const insertPhoto = async (req, res) => {
  console.log(req.body);

  const { title } = req.body;
  const image = req.file.filename;
  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  const photo = await Photo.create({
    title,
    image,
    userId: user._id,
    userName: user.name,
  });

  if (!photo) {
    return res.status(400).json({ message: "Error creating photo" });
  }

  return res.status(201).json(photo);
};

//remove a photo
const removePhoto = async (req, res) => {
  try {
    const { id } = req.params;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    const photo = await Photo.findById(mongoose.Types.ObjectId(id));

    if (!photo.userId.equals(user._id)) {
      return res.status(404).json({ message: "Photo not found" });
    }

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    await Photo.findByIdAndDelete(mongoose.Types.ObjectId(id));
    return res.status(200).json({ id: photo._id, message: "Photo deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//get all photos
const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 }).exec();
    if (!photos.length) {
      return res.status(404).json({ message: "Photos not found" });
    }
    return res.status(200).json(photos);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//get all photos from a user
const getAllPhotosFromUser = async (req, res) => {
  try {
    const { id } = req.params;

    const photos = await Photo.find({ userId: id })
      .sort({ createdAt: -1 })
      .exec();

    if (!photos.length) {
      return res.status(404).json({ message: "Photos not found" });
    }

    return res.status(200).json(photos);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//get photo by id
const getPhotoById = async (req, res) => {
  try {
    const { id } = req.params;

    const photo = await Photo.findById(mongoose.Types.ObjectId(id)).exec();

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    return res.status(200).json(photo);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//photo update
const updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;

    const { title } = req.body;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    if (!photo.userId.equals(user._id)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (title) {
      photo.title = title;
    }

    await photo.save();

    return res.status(200).json(photo);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//like a photo
const likePhoto = async (req, res) => {
  try {
    const { id } = req.params;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    if (photo.likes.includes(user._id)) {
      return res.status(400).json({ message: "Photo already liked" });
    }

    photo.likes.push(user._id);

    await photo.save();

    return res.status(200).json(photo);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//dislike a photo
const dislikePhoto = async (req, res) => {
  try {
    const { id } = req.params;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    if (!photo.likes.includes(user._id)) {
      return res.status(400).json({ message: "Photo not liked" });
    }

    photo.likes.pull(user._id);

    await photo.save();

    return res.status(200).json(photo);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//seach a photo
const searchPhoto = async (req, res) => {
  try {
    const { q } = req.query;

    const photos = await Photo.find({
      title: { $regex: q, $options: "i" },
    }).exec();

    if (!photos.length) {
      return res.status(404).json({ message: "Photos not found" });
    }

    return res.status(200).json(photos);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  insertPhoto,
  removePhoto,
  getAllPhotos,
  getAllPhotosFromUser,
  getPhotoById,
  updatePhoto,
  likePhoto,
  dislikePhoto,
  searchPhoto,
};
