<?php
/**
 * login.php — Admin login.
 * 
 * POST /api/login.php
 * Body: { email, password }
 * 
 * - Validates credentials
 * - Rate limiting (5 failed attempts per IP per 15 min)
 * - Regenerates session ID on success
 */

declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

// Rate limiting
checkRateLimit('login', RATE_LIMIT_LOGIN_MAX, RATE_LIMIT_LOGIN_WINDOW);

$data = getJsonBody();
$email = sanitizeString($data['email'] ?? '', 255);
$password = $data['password'] ?? '';

if (!$email || !$password) {
    jsonError('Email and password are required', 422);
}

// Look up admin
$stmt = db()->prepare('SELECT id, email, password_hash FROM admins WHERE email = :email LIMIT 1');
$stmt->execute([':email' => $email]);
$admin = $stmt->fetch();

// Verify password — use constant-time comparison to prevent timing attacks
if (!$admin || !password_verify($password, $admin['password_hash'])) {
    jsonError('Invalid email or password', 401);
}

// Check if password needs rehashing (PHP may have upgraded the algorithm)
if (password_needs_rehash($admin['password_hash'], PASSWORD_DEFAULT)) {
    $newHash = password_hash($password, PASSWORD_DEFAULT);
    $updateStmt = db()->prepare('UPDATE admins SET password_hash = :hash WHERE id = :id');
    $updateStmt->execute([':hash' => $newHash, ':id' => $admin['id']]);
}

// Regenerate session ID to prevent session fixation
session_regenerate_id(true);

// Set session data
$_SESSION['admin_id'] = $admin['id'];
$_SESSION['admin_email'] = $admin['email'];

jsonSuccess(['message' => 'Logged in successfully']);
