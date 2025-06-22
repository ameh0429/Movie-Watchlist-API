import sequelize from '../config/database.js';
import User from './userModel.js';
import Movie from './movieModel.js';

// Initialize associations
User.hasMany(Movie, { foreignKey: 'userId', as: 'movies' });
Movie.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { sequelize, User, Movie };