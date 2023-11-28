const express = require("express");
const router = express.Router();

// Controller
const {
  insertPhoto,
  removePhoto,
  getAllPhotos,
  getAllPhotosFromUser,
  getPhotoById,
  updatePhoto,
  likePhoto,
  dislikePhoto,
  searchPhoto
} = require("../controllers/PhotoController");

// Middlewares
const {
  photoCreateValidation,
  photoUpdateValidation,
} = require("../middlewares/photoValidation");
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const { imageUpload } = require("../middlewares/imageUpload");

// Routes
router.post(
  "/",
  authGuard,
  imageUpload.single("image"),
  photoCreateValidation(),
  validate,
  insertPhoto
);
router.get("/search", authGuard, searchPhoto);
router.delete("/:id", authGuard, removePhoto);
router.get("/", getAllPhotos);
router.get("/user/:id", authGuard, getAllPhotosFromUser);
router.get("/:id", authGuard, getPhotoById);
router.put("/:id", authGuard, photoUpdateValidation(), validate, updatePhoto);
router.post("/like/:id", authGuard, likePhoto);
router.post("/dislike/:id", authGuard, dislikePhoto);

module.exports = router;
