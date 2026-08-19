<?php

// Add a vehicle to the logged-in user's saved list.
// Stores a lightweight snapshot (make/model/year/price/image) so the Saved
// Vehicles list keeps rendering even after the unit leaves current stock.

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

$make     = trim((string)($input['make'] ?? ''));
$model    = trim((string)($input['model'] ?? ''));
$year     = trim((string)($input['year'] ?? ''));
$currency = trim((string)($input['currency'] ?? 'USD'));
$price    = is_numeric($input['price'] ?? null) ? (float)$input['price'] : 0;
$image    = trim((string)($input['image'] ?? ''));
if ($currency === '') $currency = 'USD';

$conn->query("
    CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        ref_no VARCHAR(255) NOT NULL,
        make VARCHAR(100) DEFAULT NULL,
        model VARCHAR(100) DEFAULT NULL,
        year VARCHAR(20) DEFAULT NULL,
        price DECIMAL(15,2) DEFAULT 0,
        currency VARCHAR(10) DEFAULT 'USD',
        image VARCHAR(500) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_favorite (user_id, ref_no)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
");

$stmt = $conn->prepare(
    "INSERT INTO favorites (user_id, ref_no, make, model, year, price, currency, image)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
        make = VALUES(make), model = VALUES(model), year = VALUES(year),
        price = VALUES(price), currency = VALUES(currency), image = VALUES(image)"
);
if ($stmt === false) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to prepare favorite.']);
    exit;
}
$stmt->bind_param('issssdss', $userId, $ref, $make, $model, $year, $price, $currency, $image);
$stmt->execute();

echo json_encode(['status' => 'success', 'message' => 'Vehicle saved to favorites.']);
$conn->close();
