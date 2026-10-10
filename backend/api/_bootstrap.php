<?php
/**
 * _bootstrap.php — Shared initialization for all API endpoints.
 * 
 * Handles: session start, CORS headers, database connection,
 * JSON response helpers, and rate limiting.
 */

declare(strict_types=1);

// ── Load config ───────────────────────────────────────────────────────────────

$configFile = __DIR__ . '/config.php';

if (!file_exists($configFile)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'config.php not found. Copy config.example.php to config.php and fill in your credentials.']);
    exit;
}

require_once $configFile;

// ── Session ───────────────────────────────────────────────────────────────────

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => false,   // set true in production with HTTPS
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

// ── CORS ──────────────────────────────────────────────────────────────────────

$allowedOrigins = explode(',', CORS_ALLOWED_ORIGINS);
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Content-Type ──────────────────────────────────────────────────────────────

header('Content-Type: application/json; charset=utf-8');

// ── Error handling ────────────────────────────────────────────────────────────

error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// ── Database connection ───────────────────────────────────────────────────────

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
    return $pdo;
}

// ── JSON response helpers ─────────────────────────────────────────────────────

function jsonResponse(array $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function jsonError(string $message, int $status = 400): void {
    jsonResponse(['success' => false, 'error' => $message], $status);
}

function jsonSuccess(array $data = []): void {
    jsonResponse(['success' => true] + $data);
}

// ── Rate limiting ─────────────────────────────────────────────────────────────

function rateLimitKey(string $type): string {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    return "rate_limit_{$type}_{$ip}";
}

function checkRateLimit(string $type, int $maxAttempts, int $windowSeconds): void {
    $key = rateLimitKey($type);
    $now = time();

    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = ['count' => 1, 'reset_at' => $now + $windowSeconds];
        return;
    }

    $data = &$_SESSION[$key];

    if ($now > $data['reset_at']) {
        $data = ['count' => 1, 'reset_at' => $now + $windowSeconds];
        return;
    }

    $data['count']++;

    if ($data['count'] > $maxAttempts) {
        $wait = $data['reset_at'] - $now;
        jsonError("Too many attempts. Please try again in {$wait} seconds.", 429);
    }
}

// ── Auth check ────────────────────────────────────────────────────────────────

function requireAuth(): void {
    if (empty($_SESSION['admin_id'])) {
        jsonError('Unauthorized', 401);
    }
}

// ── Input helpers ─────────────────────────────────────────────────────────────

function getJsonBody(): array {
    $body = file_get_contents('php://input');
    $data = json_decode($body, true);
    return is_array($data) ? $data : [];
}

function sanitizeString(string $input, int $maxLength = 255): string {
    return mb_substr(trim($input), 0, $maxLength);
}
