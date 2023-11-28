const photoCommentValidation = () => {
  return [
    body("text")
      .not()
      .equals("undefined")
      .withMessage("Comment is required")
      .isLength({ min: 3 })
      .withMessage("Comment must be at least 3 characters long")
      .isString()
      .withMessage("Comment must be a string"),
  ];
};

module.exports = {
  photoCommentValidation,
};
