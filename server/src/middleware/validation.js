const { validationResult } = require('express-validator');
const logger = require('../utils/logger');
const validate = (validations) => {
return async (req, res, next) => {
await Promise.all(validations.map(validation => validation.run(req)));
const errors = validationResult(req);
if (errors.isEmpty()) {
return next();
}
const extractedErrors = errors.array().map(err => ({
field: err.path,
message: err.msg,
value: err.value
}));
logger.warn('Validation failed:', {
path: req.path,
method: req.method,
errors: extractedErrors,
ip: req.ip
});
res.status(400).json({
error: 'Validation failed',
message: 'Please check your input',
errors: extractedErrors
});
};
};
const validateShiftCreation = validate([
// Add your validation rules here
]);
const validateAttendance = validate([
// Add your validation rules here
]);
module.exports = {
validate,validateShiftCreation,
validateAttendance
};