<?php
require_once __DIR__ . '/../../core/db_connection.php';
require_once __DIR__ . '/../../core/headers.php';

session_start();

// Check if user is admin
if (!isset($_SESSION['email']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["error" => "Unauthorized access. Admin privileges required."]);
    exit();
}

// Determine the HTTP method
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'PUT': // Handle update
        handleUpdate();
        break;
    case 'DELETE': // Handle delete
        handleDelete();
        break;
    default:
        http_response_code(405); // Method Not Allowed
        echo json_encode(["error" => "Method not allowed"]);
        break;
}

function handleUpdate() {
    global $conn;
    
    // Get the raw PUT data
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['invoice_number'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invoice number is required."]);
        exit();
    }

    // Prepare the update query
    $sql = "UPDATE invoices SET 
            customer_name = ?,
            email = ?,
            make = ?,
            model = ?,
            deposit_amount = ?,
            deposit_currency = ?,
            deposit_purpose = ?

            WHERE invoice_number = ?";

    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to prepare the SQL statement."]);
        exit();
    }

    $stmt->bind_param(
        "ssssdsss",
        $data['customer_name'],
        $data['email'],
        $data['make'],
        $data['model'],
        $data['deposit_amount'],
        $data['deposit_currency'],
        $data['invoice_number'],
        $data['deposit_purpose']
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => "Invoice updated successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update invoice."]);
    }

    $stmt->close();
}

function handleDelete() {
    global $conn;
    
    // For DELETE, we'll use query parameters
    parse_str(file_get_contents('php://input'), $body);
    $invoice_number = $_GET['invoice_number'] ?? $body['invoice_number'] ?? null;
    
    if (!$invoice_number) {
        http_response_code(400);
        echo json_encode(["error" => "Invoice number is required."]);
        exit();
    }

    // Prepare the delete query
    $sql = "DELETE FROM invoices WHERE invoice_number = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to prepare the SQL statement."]);
        exit();
    }

    $stmt->bind_param("s", $invoice_number);

    if ($stmt->execute()) {
        echo json_encode(["success" => "Invoice deleted successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete invoice."]);
    }

    $stmt->close();
}

$conn->close();
?>