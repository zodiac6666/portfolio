<?php
/**
 * messages.php — List or get messages (admin only).
 * 
 * GET /api/messages.php        — all messages, newest first
 * GET /api/messages.php?id=5   — specific message
 */

declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

// Require authentication
requireAuth();

// Get specific message
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;

if ($id !== null) {
    $stmt = db()->prepare('SELECT * FROM messages WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $id]);
    $message = $stmt->fetch();

    if (!$message) {
        jsonError('Message not found', 404);
    }

    // Mark as read
    $updateStmt = db()->prepare('UPDATE messages SET is_read = 1 WHERE id = :id');
    $updateStmt->execute([':id' => $id]);
    $message['is_read'] = 1;

    jsonSuccess(['message' => $message]);
}

// List all messages (newest first)
$stmt = db()->query('SELECT id, name, email, message, is_read, created_at FROM messages ORDER BY created_at DESC');
$messages = $stmt->fetchAll();

jsonSuccess(['messages' => $messages]);
