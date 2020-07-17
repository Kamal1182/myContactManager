const { body, validationResult } = require('express-validator');

const addContactValidationRules = () => {
  return [
    body('firstName').trim().not().isEmpty().withMessage('first name is required.')
      .isLength({ min: 3 }).withMessage('First Name should not be less than 3 characters.')
      .isAlpha().withMessage('First Name should only be alphabetic.'),
    body('lastName').trim().not().isEmpty().withMessage('first name is required.')
      .isLength({ min: 3 }).withMessage('Last Name should not be less than 3 characters.')
      .isAlpha().withMessage('Last Name should only be alphabetic.'),
    body('address').trim().not().isEmpty().withMessage('Address is required.'),
    body('areaCode').isNumeric().withMessage('Area code should only be a number')
      .isLength({ min: 5 }).withMessage('Area code should not be 5 numbers'),
    body('prefix').isNumeric().withMessage('Prefix code should only be a number')
      .isLength({ min: 3 }).withMessage('Prefix code should not be 3 numbers'),
    body('lineNumber').isNumeric().withMessage('Line number should only be a number')
      .isLength({ min: 4 }).withMessage('Area code should not be 4 numbers'),
    body('photoUrl').isLength({ min: 3 }).withMessage('photo url should not be less than 3 characters'),
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (errors.isEmpty()) {
    return next()
  }
  
  /* const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
   */
  const extractedErrors = {};
  errors.array().map(err => extractedErrors[err.param] = err.msg );
  console.log(extractedErrors);
  
  return res.status(422).json({
    error: extractedErrors,
  })
}//  return res.status(422).json({ error: errors.array() });


module.exports = {
  addContactValidationRules,
  validate
}