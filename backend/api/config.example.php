<?php
/**
 * config.example.php â€” Copy this file to config.php and fill in your values.
 * 
 * This file contains all configuration for the portfolio backend:
 * - Database credentials
 * - Gmail SMTP settings (for PHPMailer)
 * - CORS allowed origins
 */

declare(strict_types=1);

// â”€â”€ Database â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

define('DB_HOST', 'localhost');
define('DB_NAME', 'portfolio');
define('DB_USER', 'root');          // â† change this
define('DB_PASS', '');              // â† change this
define('DB_CHARSET', 'utf8mb4');

// â”€â”€ Gmail SMTP (PHPMailer) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// To use Gmail SMTP:
//   1. Enable 2-Factor Authentication on your Google account
//   2. Generate an "App Password" at https://myaccount.google.com/apppasswords
//   3. Use that app password below (NOT your regular Gmail password)

define('MAIL_HOST', 'smtp.gmail.com');
define('MAIL_PORT', 587);
define('MAIL_USERNAME', 'your-email@gmail.com');       // â† change this
define('MAIL_PASSWORD', 'your-app-password');           // â† change this
define('MAIL_FROM_EMAIL', 'your-email@gmail.com');      // â† change this
define('MAIL_FROM_NAME', 'Yahya Baji');

// â”€â”€ CORS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Allowed origins for CORS requests (comma-separated)
define('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:3000');

// â”€â”€ Rate Limiting â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
define('RATE_LIMIT_CONTACT_MAX', 5);    // max contact submissions per IP per hour
define('RATE_LIMIT_CONTACT_WINDOW', 3600); // 1 hour in seconds
define('RATE_LIMIT_LOGIN_MAX', 5);      // max failed login attempts per IP per 15 min
define('RATE_LIMIT_LOGIN_WINDOW', 900); // 15 minutes in seconds

// â”€â”€ Admin Setup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Secret key required to run setup-admin.php (create first admin account)
define('SETUP_SECRET_KEY', 'change-this-to-a-random-string'); // â† change this
