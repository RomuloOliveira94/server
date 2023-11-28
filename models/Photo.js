const { default: mongoose, Schema } = require("mongoose");

const photoSchema = new Schema(
  {
    image: String,
    title: String,
    likes: Array,
    commentId: [mongoose.ObjectId],
    userId: mongoose.ObjectId,
    userName: String,
  },
  {
    timestamps: true,
  }
);

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;
