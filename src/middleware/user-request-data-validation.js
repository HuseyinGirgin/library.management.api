import { param, body, validationResult } from 'express-validator';

const validateRequest = [
    body('name')
        .optional()
        .isLength({ min: 3 })
        .withMessage('User name must be at least 3 characters long'),
    param('id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID must be a positive integer'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        next();
    }
];

export default validateRequest;