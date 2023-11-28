const express = require("express");
const router = express.Router();
const {
  commentPhoto,
  deleteComment,
  editComment,
} = require("../controllers/CommentController");
const { photoCommentValidation } = require("../middlewares/photoValidation");
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");

router.post(
  "/:photoId/comments",
  authGuard,
  photoCommentValidation(),
  validate,
  commentPhoto
);
router.delete("/:photoId/comments/:commentId", authGuard, deleteComment);
router.put(
  "/:photoId/comments/:commentId",
  authGuard,
  photoCommentValidation(),
  validate,
  editComment
);

module.exports = router;
