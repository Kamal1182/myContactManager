const { body, validationResult } = require('express-validator');

const loginValidationRules = () => {
  return [
    body('username').trim().not().isEmpty().withMessage('Username is required.'),
    body('password').not().isEmpty().withMessage('password is required.'),
  ]
}

const addContactValidationRules = () => {
  return [
    body('firstName').trim().not().isEmpty().withMessage('first name is required.')
      .isLength({ min: 3 }).withMessage('First Name should not be less than 3 characters.')
      //.isAlpha().withMessage('First Name should only be alphabetic.'),
      .matches(/^([A-Z' ]+)(?:[A-Z])$/i).withMessage('First Name should only be alphabetic.'),
    body('lastName').trim().not().isEmpty().withMessage('first name is required.')
      .isLength({ min: 3 }).withMessage('Last Name should not be less than 3 characters.')
      .isAlpha().withMessage('Last Name should only be alphabetic.'),
    body('address').trim().not().isEmpty().withMessage('Address is required.'),
    body('areaCode').trim().isNumeric().withMessage('Area code should only be a number')
      .isLength({ min: 3, max: 3 }).withMessage('Area code should be 3 numbers'),
    body('prefix').trim().isNumeric().withMessage('Prefix code should only be a number')
      .isLength({ min: 3, max: 3 }).withMessage('Prefix code should be 3 numbers'),
    body('lineNumber').trim().isNumeric().withMessage('Line number should only be a number')
      .isLength({ min: 4, max: 4 }).withMessage('Line number should be 4 numbers'),
    //body('photoUrl').isLength({ min: 3 }).withMessage('photo url should not be less than 3 characters'),
    //body('photoUrl').notEmpty().withMessage('You must enter a photo'),
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
  console.log('from addUserValidation');
  console.log(extractedErrors);
  
  return res.status(422).json({
    error: extractedErrors,
  })
}//  return res.status(422).json({ error: errors.array() });


module.exports = {
  loginValidationRules,
  addContactValidationRules,
  validate
}