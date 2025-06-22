import Joi from 'joi';

export const validateMovie = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(255).required(),
    genre: Joi.string().valid('Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Adventure', 'Animation', 'Documentary', 'Fantasy', 'Mystery').required(),
    rating: Joi.number().min(0).max(10).optional(),
    watchStatus: Joi.string().valid('want_to_watch', 'watching', 'watched').optional(),
    personalNotes: Joi.string().optional(),
    releaseYear: Joi.number().integer().min(1888).max(new Date().getFullYear() + 5).optional(),
    director: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  next();
};

export const validateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    emailNotifications: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  next();
};

export const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  next();
};