<?php
/**
 * contact.php — Handle contact form submissions.
 * 
 * POST /api/contact.php
 * Body: { name, email, message, company }
 * 
 * - Validates input
 * - Honeypot check (company field)
 * - Rate limiting (5 per IP per hour)
 * - Saves to messages table
 * * - Sends email via PHPMailer
 */

declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

// Rate limiting
checkRateLimit('contact', RATE_LIMIT_CONTACT_MAX, RATE_LIMIT_CONTACT_WINDOW);

// Get input
$data = getJsonBody();

$name = sanitizeString($data['name'] ?? '', 255);
$email = sanitizeString($data['email'] ?? '', 255);
$message = trim($data['message'] ?? '');
$honeypot = trim($data['company'] ?? '');

// Honeypot — silently reject bots
if ($honeypot !== '') {
    // Pretend success to avoid revealing the trap
    jsonSuccess(['message' => 'Message sent successfully']);
}

// Validation
$errors = [];

if ($name === '') {
    $errors['name'] = 'Name is required';
}

if ($email === '') {
    $errors['email'] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Invalid email address';
}

if ($message === '') {
    $errors['message'] = 'Message is required';
} elseif (mb_strlen($message) > 5000) {
    $errors['message'] = 'Message is too long (max 5000 characters)';
}

if ($errors) {
    jsonResponse(['success' => false, 'errors' => $errors], 422);
}

// Save to database
try {
    $stmt = db()->prepare(
        'INSERT INTO messages (name, email, message) VALUES (:name, :email, :message)'
    );
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':message' => $message,
    ]);
} catch (PDOException $e) {
    error_log('Database error in contact.php: ' . $e->getMessage());
    jsonError('Failed to save message. Please try again.', 500);
}

// Send email via PHPMailer
$mailSent = false;
try {
    $mailAutoload = __DIR__ . '/../vendor/autoload.php';
    if (file_exists($mailAutoload)) {
        require_once $mailAutoload;
        
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = MAIL_HOST;
        $mail->Port = MAIL_PORT;
        $mail->SMTPAuth = true;
        $mail->Username = MAIL_USERNAME;
        $mail->Password = MAIL_PASSWORD;
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->setFrom(MAIL_FROM_EMAIL, MAIL_FROM_NAME);
        $mail->addAddress(MAIL_FROM_EMAIL, MAIL_FROM_NAME);
        $mail->addReplyTo($email, $name);
        $mail->Subject = "New Portfolio Message from {$name}";
        $mail->Body = "Name: {$name}\nEmail: {$email}\n\nMessage:\n{$message}";
        $mail->AltBody = strip_tags($mail->Body);
        
        $mailSent = $mail->send();
    }
} catch (Exception $e) {
    error_log('Mailer error in contact.php: ' . $e->getMessage());
    // Don't fail the request if email fails — message is already saved
}

jsonSuccess(['message' => 'Message sent successfully']);
