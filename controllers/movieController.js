import { Movie } from '../models/index.js';
import { Op } from 'sequelize';
import emailService from '../service/emailService.js';

export const createMovie = async (req, res) => {
  try {
    const movieData = {
      ...req.body,
      userId: req.user.id,
    };

    const movie = await Movie.create(movieData);

    // Send email notification
    await emailService.sendWatchlistUpdateNotification(req.user, movie, 'added');

    res.status(201).json({
      message: 'Movie added to watchlist successfully',
      movie,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMovies = async (req, res) => {
  try {
    const { status, genre, rating, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { userId: req.user.id };

    // Apply filters
    if (status) {
      whereClause.watchStatus = status;
    }

    if (genre) {
      whereClause.genre = genre;
    }

    if (rating) {
      whereClause.rating = { [Op.gte]: parseFloat(rating) };
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { director: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows: movies } = await Movie.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      movies,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalMovies: count,
        hasNext: offset + movies.length < count,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({ movie });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const oldStatus = movie.watchStatus;
    const oldRating = movie.rating;

    await movie.update(req.body);

    // Determine notification type
    let notificationType = 'updated';
    if (req.body.watchStatus && req.body.watchStatus !== oldStatus) {
      notificationType = 'status_changed';
    } else if (req.body.rating && req.body.rating !== oldRating) {
      notificationType = 'rated';
    }

    // Send email notification
    await emailService.sendWatchlistUpdateNotification(req.user, movie, notificationType);

    res.json({
      message: 'Movie updated successfully',
      movie,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    await movie.destroy();

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMovieStats = async (req, res) => {
  try {
    const stats = await Movie.findAll({
      where: { userId: req.user.id },
      attributes: [
        'watchStatus',
        [Movie.sequelize.fn('COUNT', '*'), 'count'],
      ],
      group: ['watchStatus'],
      raw: true,
    });

    const genreStats = await Movie.findAll({
      where: { userId: req.user.id },
      attributes: [
        'genre',
        [Movie.sequelize.fn('COUNT', '*'), 'count'],
      ],
      group: ['genre'],
      order: [[Movie.sequelize.fn('COUNT', '*'), 'DESC']],
      raw: true,
    });

    const totalMovies = await Movie.count({
      where: { userId: req.user.id },
    });

    const averageRating = await Movie.findOne({
      where: {
        userId: req.user.id,
        rating: { [Op.not]: null },
      },
      attributes: [
        [Movie.sequelize.fn('AVG', Movie.sequelize.col('rating')), 'average'],
      ],
      raw: true,
    });

    res.json({
      totalMovies,
      averageRating: averageRating?.average ? parseFloat(averageRating.average).toFixed(1) : null,
      statusBreakdown: stats,
      genreBreakdown: genreStats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};