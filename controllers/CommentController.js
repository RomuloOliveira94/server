const Comment = require("../models/Comment");
const Photo = require("../models/Photo");
const User = require("../models/User");
const mongoose = require("mongoose");

const commentPhoto = async (req, res) => {
  try {
    console.log(req.params.photoId);
    const { photoId } = req.params;
    const { text } = req.body;
    const reqUser = req.user;
    const user = await User.findById(reqUser._id);
    const photo = await Photo.findById(photoId);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    const comment = await Comment.create({
      text,
      userId: user._id,
      userName: user.name,
      userImage: user.image,
      photoId: photo._id,
    });

    if (!comment) {
      return res.status(400).json({ message: "Error creating comment" });
    }

    photo.commentId.push(comment._id);

    await photo.save();

    return res.status(200).json(photo);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const editComment = async (req, res) => {
  try {
    const { photoId, commentId } = req.params;
    const { text } = req.body;
    const reqUser = req.user;
    const user = await User.findById(reqUser._id);
    const photo = await Photo.findById(photoId);
    const comment = await Comment.findById(commentId);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (!comment.userId.equals(user._id)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    comment.text = text;

    await comment.save();

    return res.status(200).json(comment);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { photoId, commentId } = req.params;
    const photo = await Photo.findById(photoId);
    const reqUser = req.user;
    const user = await User.findById(reqUser._id);
    const comment = await Comment.findById(commentId);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (!comment.userId.equals(user._id)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Comment.findByIdAndDelete(commentId);

    photo.commentId.pull(commentId);

    await photo.save();

    return res
      .status(200)
      .json({ id: comment._id, message: "Comment deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  commentPhoto,
  editComment,
  deleteComment,
};
