export const errorHandler = (error, req, res, next) => {
  console.error(error.stack);

  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({ error: 'Validation Error', details: errors });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  if (error.code === 11000) {
    return res.status(400).json({ error: 'Resource already exists' });
  }

  res.status(500).json({ error: 'Internal server error' });
};
