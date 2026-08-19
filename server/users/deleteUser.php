<?php
// server/users/deleteUser.php
require_once __DIR__ . '/../core/db_connection.php';
require_once __DIR__ . '/../core/headers.php';
session_start();

// allow only admins and prevent self‑deletion
if (!isset($_SESSION['user_id']) || $_SESSION['role']!=='admin') {
    http_response_code(403);
    echo json_encode(['status'=>'error','message'=>'Not authorised']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$userId = intval($data['user_id'] ?? 0);

if (!$userId || $userId == $_SESSION['user_id']) {
    echo json_encode(['status'=>'error','message'=>'Invalid user']);
    exit;
}

$stmt = $conn->prepare('DELETE FROM users WHERE id = ?');
$stmt->bind_param('i', $userId);

if ($stmt->execute()) {
    echo json_encode(['status'=>'success']);
} else {
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>$stmt->error]);
}
$stmt->close();
$conn->close();

?>