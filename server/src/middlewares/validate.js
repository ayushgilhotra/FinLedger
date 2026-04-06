const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        code: 'INVALID_INPUT',
        fields: result.error.issues.map(err => ({
          path: err.path,
          message: err.message
        }))
      });
    }
    req.body = result.data;
    next();
  };
};

module.exports = validate;
