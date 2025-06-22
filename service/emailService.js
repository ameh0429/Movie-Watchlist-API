import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendWatchlistUpdateNotification(user, movie, action) {
    if (!user.emailNotifications) return;

    const subject = `Movie Watchlist Update - ${movie.title}`;
    let message = '';

    switch (action) {
      case 'added':
        message = `You've added "${movie.title}" to your watchlist!`;
        break;
      case 'status_changed':
        message = `You've updated the status of "${movie.title}" to "${movie.watchStatus.replace('_', ' ')}"`;
        break;
      case 'rated':
        message = `You've rated "${movie.title}" ${movie.rating}/10`;
        break;
      default:
        message = `Your movie "${movie.title}" has been updated`;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Movie Watchlist Update</h2>
        <p>Hi ${user.name},</p>
        <p>${message}</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #555;">Movie Details:</h3>
          <p><strong>Title:</strong> ${movie.title}</p>
          <p><strong>Genre:</strong> ${movie.genre}</p>
          <p><strong>Status:</strong> ${movie.watchStatus.replace('_', ' ')}</p>
          ${movie.rating ? `<p><strong>Rating:</strong> ${movie.rating}/10</p>` : ''}
          ${movie.personalNotes ? `<p><strong>Notes:</strong> ${movie.personalNotes}</p>` : ''}
        </div>
        <p>Happy watching!</p>
        <p>Your Movie Watchlist Team</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject,
        html,
      });
      console.log(`Email sent to ${user.email} for movie: ${movie.title}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendWelcomeEmail(user) {
    const subject = 'Welcome to Movie Watchlist!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Movie Watchlist!</h2>
        <p>Hi ${user.name},</p>
        <p>Welcome to your personal movie tracking experience! You can now:</p>
        <ul>
          <li>Add movies to your watchlist</li>
          <li>Track your watching progress</li>
          <li>Rate and review movies</li>
          <li>Filter by genre and status</li>
        </ul>
        <p>Start building your movie collection today!</p>
        <p>Best regards,<br>Movie Watchlist Team</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject,
        html,
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }
}

export default new EmailService();