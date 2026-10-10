# Portfolio Backend

PHP backend for the portfolio website. Handles contact form submissions, admin authentication, and message management.

## Setup

### 1. Create the Database

Import the schema into MySQL:

```bash
mysql -u root -p < backend/database/schema.sql
```

Or use phpMyAdmin to import `backend/database/schema.sql`.

### 2. Configure the Backend

Copy the example config and fill in your credentials:

```bash
cp backend/api/config.example.php backend/api/config.php
```

Edit `backend/api/config.php`:
- Set your database credentials
- Set your Gmail SMTP settings (use an [App Password](https://myaccount.google.com/apppasswords))
- Change `SETUP_SECRET_KEY` to a random string

### 3. Install PHPMailer

```bash
cd backend
composer require phpmailer/phpmailer
```

### 4. Create the First Admin

Send a POST request to `setup-admin.php`:

```bash
curl -X POST http://localhost:8000/api/setup-admin.php \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your-password","secret":"your-setup-secret"}'
```

**Delete or disable `setup-admin.php` after creating your first admin.**

### 5. Configure the Frontend

The frontend expects the API at `http://localhost:8000` by default. Update `.env` if needed:

```
VITE_API_URL=http://localhost:8000
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/contact.php` | Submit contact form | No |
| POST | `/api/login.php` | Admin login | No |
| POST | `/api/logout.php` | Admin logout | Yes |
| GET | `/api/messages.php` | List all messages | Yes |
| GET | `/api/messages.php?id=1` | Get specific message | Yes |
| POST | `/api/delete.php` | Delete a message | Yes |
| POST | `/api/setup-admin.php` | Create first admin | Secret key |

## Security Features

- Prepared statements (PDO) — prevents SQL injection
- Password hashing with `password_hash()` / `password_verify()`
- Session regeneration on login
- Rate limiting on login and contact form
- Honeypot field on contact form
- CORS headers configured for development
- HTTP-only session cookies
