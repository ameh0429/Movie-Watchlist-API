import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255],
    },
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isIn: [['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Adventure', 'Animation', 'Documentary', 'Fantasy', 'Mystery']],
    },
  },
  rating: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: true,
    validate: {
      min: 0,
      max: 10,
    },
  },
  watchStatus: {
    type: DataTypes.ENUM('want_to_watch', 'watching', 'watched'),
    allowNull: false,
    defaultValue: 'want_to_watch',
  },
  personalNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  releaseYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1888,
      max: new Date().getFullYear() + 5,
    },
  },
  director: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'movies',
  timestamps: true,
  indexes: [
    {
      fields: ['userId'],
    },
    {
      fields: ['genre'],
    },
    {
      fields: ['watchStatus'],
    },
  ],
});

export default Movie;