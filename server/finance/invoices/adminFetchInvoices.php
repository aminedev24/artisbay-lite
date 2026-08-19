<?php
require_once __DIR__ . '/../../core/db_connection.php';
require_once __DIR__ . '/../../core/headers.php';

session_start();

// Check if user is admin (you should implement proper admin authentication)
if (!isset($_SESSION['email']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403); // Forbidden
    echo json_encode(["error" => "Unauthorized access. Admin privileges required."]);
    exit();
}

// Prepare the SQL query to fetch all invoices
$sql = "SELECT invoice_number, vehicle_ref, make, model, customer_name, email, deposit_amount, 
               description, created_at, deposit_purpose, vehicle_description, 
               mileage, chasis_number, engine_capacity, deposit_currency
        FROM invoices 
        ORDER BY created_at DESC";

$stmt = $conn->prepare($sql);

if ($stmt === false) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to prepare the SQL statement."]);
    exit();
}

$stmt->execute();
$result = $stmt->get_result();

$invoices = [];
while ($row = $result->fetch_assoc()) {
    $invoices[] = $row;
}

header('Content-Type: application/json');
echo json_encode($invoices);

$stmt->close();
$conn->close();
?>