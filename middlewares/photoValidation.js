const { body } = require('express-validator');

const photoCreateValidation = () => {
    return [
        body('title')
            .not()
            .equals('undefined')
            .withMessage('Title is required')
            .isLength({ min: 3 })
            .withMessage('Title must be at least 3 characters long')
            .isString()
            .withMessage('Title must be a string'),
        body('image').custom((value, { req }) => {
            if (!req.file) {
                throw new Error('Image is required');
            }
            return true;
        }),
    ];
};

const photoUpdateValidation = () => {
    return [
        body('title')
            .optional()
            .not()
            .equals('undefined')
            .withMessage('Title is required')
            .isLength({ min: 3 })
            .withMessage('Title must be at least 3 characters long')
            .isString()
            .withMessage('Title must be a string'),
    ];
};

const photoCommentValidation = () => {
    return [
        body('text')
            .not()
            .equals('undefined')
            .withMessage('Comment is required')
            .isLength({ min: 3 })
            .withMessage('Comment must be at least 3 characters long')
            .isString()
            .withMessage('Comment must be a string'),
    ];
};

module.exports = {
    photoCreateValidation,
    photoUpdateValidation,
    photoCommentValidation
};

