<?php
/**
 * delete.php — Delete a message (admin only).
 * 
 * POST /api/delete.php
 * Body: { id }
 */

declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

// Require authentication
requireAuth();

$data = getJsonBody();
$id = isset($data['id']) ? (int) $data['id'] : 0;

if (!$id) {
    jsonError('Message ID is required', 422);
}

// Delete the message
$stmt = db()->prepare('DELETE FROM messages WHERE id = :id');
$stmt->execute([':id' => $id]);

if ($stmt->rowCount() === 0) {
    jsonError('Message not found', 404);
}

jsonSuccess(['message' => 'Message deleted']);
