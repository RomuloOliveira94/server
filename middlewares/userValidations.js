const { body } = require("express-validator");

const userCreateValidation = () => {
  return [
    body("name")
      .isString()
      .withMessage("The name is required.")
      .isLength({ min: 3 })
      .withMessage("The name needs a minimum of 3 characters"),
    body("email")
      .isString()
      .withMessage("The E-mail is required.")
      .isEmail()
      .withMessage("The E-mail is invalid"),
    body("password")
      .isString()
      .withMessage("The password is requires")
      .isLength({ min: 6 })
      .withMessage("The password needs a minimum os 6 characters"),
    body("confirmPassword")
      .isString()
      .withMessage("The password confirm is requires")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("The passwords don't match");
        }
        return true;
      }),
  ];
};

const loginValidation = () => {
  return [
    body("email")
      .isString()
      .withMessage("The E-mail is required.")
      .isEmail()
      .withMessage("The E-mail is invalid."),
    body("password").isString().withMessage("The password is required."),
  ];
};

const userUpdateValidation = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("The name is required.")
      .isLength({ min: 3 })
      .withMessage("The name needs a minimum of 3 characters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("The password needs a minimum os 6 characters"),
  ];
};

module.exports = {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
};
