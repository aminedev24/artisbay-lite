<?php

// Admin inbox for vehicle inquiries submitted via the details-page form
// (server/inquiries/submitVehicleInquiry.php). GET lists them, POST with
// action=delete removes one. Admin role required.

session_start();
require_once __DIR__ . '/../core/db_connection.php';
require_once __DIR__ . '/../core/db_migrations.php';
require_once __DIR__ . '/../core/headers.php';
require_once __DIR__ . '/../core/csrf.php';

if (!isset($_SESSION['user_id']) || ($_SESSION['role'] ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Admin access required."]);
    exit;
}

$conn->query("
    CREATE TABLE IF NOT EXISTS vehicle_inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vehicle_ref VARCHAR(255) DEFAULT NULL,
        vehicle_name VARCHAR(255) DEFAULT NULL,
        vehicle_status VARCHAR(50) DEFAULT NULL,
        vehicle_details TEXT DEFAULT NULL,
        page_url VARCHAR(500) DEFAULT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) DEFAULT NULL,
        country VARCHAR(100) DEFAULT NULL,
        city VARCHAR(100) DEFAULT NULL,
        address VARCHAR(255) DEFAULT NULL,
        message TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
");
ensure_columns($conn, 'vehicle_inquiries', [
    'vehicle_details' => 'TEXT DEFAULT NULL',
    'page_url' => 'VARCHAR(500) DEFAULT NULL',
]);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_validate();

    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        $input = $_POST;
    }

    $action = trim((string)($input['action'] ?? ''));
    if ($action === 'delete') {
        $id = (int)($input['id'] ?? 0);
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid inquiry id."]);
            exit;
        }
        $stmt = $conn->prepare("DELETE FROM vehicle_inquiries WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        echo json_encode(["status" => "success", "message" => "Inquiry deleted."]);
        $conn->close();
        exit;
    }

    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Unknown action."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit;
}

$result = $conn->query("SELECT * FROM vehicle_inquiries ORDER BY id DESC");

$inquiries = [];
while ($row = $result->fetch_assoc()) {
    if (!empty($row['vehicle_details'])) {
        $decoded = json_decode($row['vehicle_details'], true);
        $row['vehicle_details'] = is_array($decoded) ? $decoded : null;
    }
    $inquiries[] = $row;
}

echo json_encode(["status" => "success", "inquiries" => $inquiries]);
$conn->close();
