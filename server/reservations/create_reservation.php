<?php
header('Content-Type: application/json');
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Basic auth check via user session
if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'unauthorized', 'message' => 'Please sign in to reserve.']);
    exit;
}

require_once __DIR__ . '/../core/db_connection.php';
require_once __DIR__ . '/../core/db_migrations.php';

$input = json_decode(file_get_contents('php://input'), true);

$vehicle_ref = isset($input['vehicle_ref']) ? trim($input['vehicle_ref']) : '';
$make = isset($input['make']) ? trim($input['make']) : '';
$model = isset($input['model']) ? trim($input['model']) : '';
$session_full_name = isset($_SESSION['full_name']) ? trim($_SESSION['full_name']) : '';
$session_email = isset($_SESSION['email']) ? trim($_SESSION['email']) : '';
$user_full_name = $session_full_name ?: (isset($input['user_full_name']) ? trim($input['user_full_name']) : '');
$user_email = $session_email ?: (isset($input['user_email']) ? trim($input['user_email']) : '');
$payment_plan = isset($input['payment_plan']) ? trim($input['payment_plan']) : '';
$country = isset($input['country']) ? trim($input['country']) : '';
$destination_country = $country;
$port = isset($input['port']) ? trim($input['port']) : '';
$delivery = isset($input['delivery']) ? trim($input['delivery']) : '';
$inspection_required = !empty($input['inspection_required']) ? 1 : 0;
$deposit_amount = isset($input['deposit_amount']) ? floatval($input['deposit_amount']) : 0;
$deposit_currency = isset($input['deposit_currency']) ? trim($input['deposit_currency']) : '';
$deposit_purpose = isset($input['deposit_purpose']) ? trim($input['deposit_purpose']) : '';
$user_id = $_SESSION['user_id'];

if (!$vehicle_ref) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing vehicle reference']);
    exit;
}

// Create table if it does not exist
$createTableSql = "
CREATE TABLE IF NOT EXISTS reserved_vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  vehicle_ref VARCHAR(255) NOT NULL,
  make VARCHAR(100) DEFAULT NULL,
  model VARCHAR(100) DEFAULT NULL,
  user_full_name VARCHAR(255) DEFAULT NULL,
  user_email VARCHAR(255) DEFAULT NULL,
  payment_plan VARCHAR(50) NOT NULL,
  destination_country VARCHAR(100) DEFAULT NULL,
  port VARCHAR(100) DEFAULT NULL,
  delivery VARCHAR(255) DEFAULT NULL,
  inspection_required TINYINT(1) DEFAULT 0,
  deposit_amount DECIMAL(15,2) DEFAULT 0,
  deposit_currency VARCHAR(10) DEFAULT NULL,
  deposit_purpose VARCHAR(255) DEFAULT NULL,
  status VARCHAR(50) DEFAULT 'reserved',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
";
$conn->query($createTableSql);

// Ensure make/model columns exist even if table was created earlier without them
ensure_columns($conn, 'reserved_vehicles', [
    'make' => 'VARCHAR(100) DEFAULT NULL',
    'model' => 'VARCHAR(100) DEFAULT NULL',
    'user_full_name' => 'VARCHAR(255) DEFAULT NULL',
    'user_email' => 'VARCHAR(255) DEFAULT NULL',
    'deposit_currency' => 'VARCHAR(10) DEFAULT NULL',
    'deposit_purpose' => 'VARCHAR(255) DEFAULT NULL',
    'destination_country' => 'VARCHAR(100) DEFAULT NULL',
]);

// Prevent duplicate reservations for the same user and vehicle
$checkStmt = $conn->prepare("SELECT id FROM reserved_vehicles WHERE user_id = ? AND vehicle_ref = ? LIMIT 1");
$checkStmt->bind_param("is", $user_id, $vehicle_ref);
$checkStmt->execute();
$checkStmt->store_result();
if ($checkStmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['status' => 'duplicate', 'message' => 'Vehicle already reserved for this user.']);
    exit;
}
$checkStmt->close();

$stmt = $conn->prepare("INSERT INTO reserved_vehicles (user_id, vehicle_ref, make, model, user_full_name, user_email, payment_plan, destination_country, port, delivery, inspection_required, deposit_amount, deposit_currency, deposit_purpose) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param(
    "isssssssssidss",
    $user_id,
    $vehicle_ref,
    $make,
    $model,
    $user_full_name,
    $user_email,
    $payment_plan,
    $destination_country,
    $port,
    $delivery,
    $inspection_required,
    $deposit_amount,
    $deposit_currency,
    $deposit_purpose
);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to reserve vehicle']);
    exit;
}

echo json_encode([
    'status' => 'success',
    'message' => 'Vehicle reserved',
    'reservation_id' => $stmt->insert_id,
]);
