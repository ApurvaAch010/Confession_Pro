// middleware/bodyvalidator.js
export const bodyvalidator = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    // err.errors is an array of validation error messages
    return res.status(400).json({ errors: err.errors });
  }
};
