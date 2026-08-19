<?php

// Remove a vehicle from the logged-in user's saved list.

session_start();
require_once __DIR__ . '/../core/db_connection.php';
require_once __DIR__ . '/../core/headers.php';
require_once __DIR__ . '/../core/csrf.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Please log in to save vehicles.']);
    exit;
}
$userId = (int)$_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

csrf_validate();

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    $input = $_POST;
}

$ref = trim((string)($input['ref'] ?? ''));
if ($ref === '') {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Vehicle reference is required.']);
    exit;
}

$stmt = $conn->prepare("DELETE FROM favorites WHERE user_id = ? AND ref_no = ?");
if ($stmt === false) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to prepare favorite.']);
    exit;
}
$stmt->bind_param('is', $userId, $ref);
$stmt->execute();

echo json_encode(['status' => 'success', 'message' => 'Vehicle removed from favorites.']);
$conn->close();
