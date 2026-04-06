const { AppError } = require('../utils/errors');

const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError('Access denied', 403, 'FORBIDDEN');
    }
    next();
  };
};

module.exports = checkRole;
