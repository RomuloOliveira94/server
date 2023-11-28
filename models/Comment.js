const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  userImage: String,
  userName: String,
  photoId: { type: Schema.Types.ObjectId, ref: 'Photo' },
}, {
  timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;