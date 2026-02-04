import { body, query, validationResult } from 'express-validator';

// Validation error handler
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Expense validation rules
export const expenseValidationRules = () => {
  return [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    body('amount')
      .notEmpty()
      .withMessage('Amount is required')
      .isFloat({ min: 0.01 })
      .withMessage('Amount must be greater than 0'),
    body('category')
      .notEmpty()
      .withMessage('Category is required')
      .isIn(['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Others'])
      .withMessage('Invalid category'),
    body('date')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),
    body('paymentMethod')
      .optional()
      .isIn(['Cash', 'Card', 'UPI', 'Net Banking', 'Others'])
      .withMessage('Invalid payment method'),
  ];
};

// Query validation for filters
export const filterValidationRules = () => {
  return [
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid start date format'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid end date format'),
    query('category')
      .optional()
      .isIn(['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Others'])
      .withMessage('Invalid category'),
    query('minAmount')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Minimum amount must be 0 or greater'),
    query('maxAmount')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Maximum amount must be 0 or greater'),
  ];
};

// User profile validation
export const userProfileValidationRules = () => {
  return [
    body('monthlyBudget')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Monthly budget must be 0 or greater'),
    body('categories')
      .optional()
      .isArray()
      .withMessage('Categories must be an array'),
  ];
};