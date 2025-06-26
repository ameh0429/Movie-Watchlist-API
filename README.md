# Movie-Watchlist-API

A RESTful API for managing personal movie watchlists built with Node.js, Express.js, PostgreSQL, and Sequelize.

## Features

- User authentication with JWT
- Add movies to watchlist with details (title, genre, rating, status, notes)
- Track watch status (want to watch, watching, watched)
- Filter movies by status, genre, or rating
- Search movies by title or director
- Email notifications for watchlist updates
- Movie statistics and analytics
- Rate limiting and security middleware

## Project Structure
```
src/
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   └── movieController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── validation.js
├── models/
│   ├── index.js
│   ├── userModel.js
│   └── movieModel.js
├── routes/
│   ├── index.js
│   ├── authRoutes.js
│   └── movieRoutes.js
├── service/
│   └── emailService.js
└── app.js
```


## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your PostgreSQL database
4. Create a `.env` file with your configuration
5. Start the server: `npm run dev`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

### Movies
- POST `/api/movies` - Add movie to watchlist
- GET `/api/movies` - Get user's movies (with filtering)
- GET `/api/movies/:id` - Get specific movie
- PUT `/api/movies/:id` - Update movie
- DELETE `/api/movies/:id` - Delete movie
- GET `/api/movies/stats` - Get user's movie statistics

### Query Parameters for GET /api/movies
- `status`: Filter by watch status (want_to_watch, watching, watched)
- `genre`: Filter by genre
- `rating`: Filter by minimum rating
- `search`: Search by title or director
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)


## Environment Variables

```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=movie_watchlist
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

## Usage Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Add Movie
```bash
curl -X POST http://localhost:3000/api/movies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Inception",
    "genre": "Sci-Fi",
    "rating": 9.0,
    "watchStatus": "watched",
    "personalNotes": "Mind-bending masterpiece",
    "releaseYear": 2010,
    "director": "Christopher Nolan"
  }'
```

### Get Movies with Filters
```bash
curl "http://localhost:3000/api/movies?status=watched&genre=Sci-Fi&page=1&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Schema

### Users Table
- id (UUID, Primary Key)
- name (String, Required)
- email (String, Unique, Required)
- password (String, Hashed, Required)
- emailNotifications (Boolean, Default: true)
- createdAt, updatedAt (Timestamps)

### Movies Table
- id (UUID, Primary Key)
- title (String, Required)
- genre (Enum, Required)
- rating (Decimal 0-10, Optional)
- watchStatus (Enum: want_to_watch, watching, watched)
- personalNotes (Text, Optional)
- releaseYear (Integer, Optional)
- director (String, Optional)
- userId (UUID, Foreign Key)
- createdAt, updatedAt (Timestamps)

## Email Notifications

The API sends email notifications for:
- Welcome email on registration
- Movie added to watchlist
- Watch status changes
- Movie ratings

## What I Learned
During the development of this project, I gained hands-on experience in:

- Building a RESTful API using Node.js and Express
- Understanding and applying CRUD operations
- Structuring an Express project with route separation
- Using nodemon for development
- Basic use of middleware like express.json()
- Testing endpoints using tools like Postman and curl

## Future Improvements
- **Swagger Documentation**: Generate API docs using Swagger UI
- **Deployment**: Deploy the API to Render, Railway, Heroku or AWS

## Author
Ameh Mathias Ejeh
[LinkedIn](https://www.linkedin.com/in/ameh-mathias-ejeh-7444042b4) • [GitHub](https://github.com/ameh0429)
