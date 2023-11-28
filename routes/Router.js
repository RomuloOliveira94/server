const express = require("express");
const router = express();

router.use("/api/users", require("./UserRoutes"));
router.use("/api/photos", require("./PhotoRoutes"));
router.use("/api/photos", require("./CommentRoutes"));

router.get("/", (req, res) => {
  res.send("Gerando");
});

router.get("/about", (req, res) => {
  res.send("Gerando");
});

module.exports = router;
