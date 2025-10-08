import { body, validationResult } from 'express-validator'

export const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((v) => v.run(req)))
  const errors = validationResult(req)
  if (errors.isEmpty()) return next()
  return next(errors)
}

export const authValidators = {
  register: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  login: [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ]
}

export const taskValidators = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().isString().isLength({ max: 5000 }).withMessage('Description too long'),
    body('category').optional().trim().isString().withMessage('Invalid category'),
    body('dueDate').optional().isISO8601().toDate().withMessage('Invalid due date'),
    body('userId').optional().isMongoId().withMessage('Invalid userId')
  ],
  update: [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().isString().isLength({ max: 5000 }).withMessage('Description too long'),
    body('category').optional().trim().isString().withMessage('Invalid category'),
    body('dueDate').optional().isISO8601().toDate().withMessage('Invalid due date'),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status')
  ],
  statusOnly: [
    body('status').exists().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status')
  ]
}

export const profileValidators = {
  update: [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Invalid email')
  ],
  passwordChange: [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ]
}
