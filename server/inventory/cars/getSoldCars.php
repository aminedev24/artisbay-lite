<?php
session_start();
require_once __DIR__ . '/../../core/db_connection.php';
require_once __DIR__ . '/../../core/headers.php';


// Ensure user_id is set in the session
if (!isset($_SESSION['user_id'])) {
    error_log("Unauthorized access attempt. User ID not found in session."); // Log error
    http_response_code(401); // Unauthorized
    echo json_encode(["error" => "Unauthorized access. User ID not found in session."]);
    exit();
}

$user_id = $_SESSION['user_id']; // Get the user ID from session

// Prepare SQL statement with a JOIN clause to include user information
$sql = "SELECT 
            soldcars.consignee, soldcars.color, soldcars.year, soldcars.car_id, 
            soldcars.chassis_number, soldcars.make, soldcars.car_model, soldcars.engine_capacity,soldcars.port_of_discharge, 
            soldcars.mileage, soldcars.price, soldcars.currency, soldcars.image_urls,soldcars.port_of_loading, 
            soldcars.stock_id, soldcars.size, soldcars.dimension, soldcars.engine_type,soldcars.category,
            soldcars.seats, soldcars.destination, soldcars.port, soldcars.fuel, soldcars.doors, soldcars.departure_port,
            users.full_name, users.address, users.phone, users.company,
            deposits.amount, soldcars.user_id
        FROM soldcars
        JOIN users ON soldcars.user_id = users.id
        LEFT JOIN deposits ON soldcars.stock_id = deposits.consumption_value
        WHERE soldcars.user_id = ?
        ";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    error_log("Database error: Failed to prepare statement. Error: " . $conn->error); // Log error
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "Internal server error."]);
    exit();
}

$stmt->bind_param("i", $user_id); // Bind the user_id as an integer

if (!$stmt->execute()) {
    error_log("Database error: Failed to execute statement. Error: " . $stmt->error); // Log error
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "Internal server error."]);
    exit();
}

$result = $stmt->get_result();

$cars = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Convert image URLs from JSON string to an array
        $row['image_urls'] = json_decode($row['image_urls'], true);
        $cars[] = $row;
    }
} else {
    error_log("No results found for user ID: " . $user_id); // Log info
}

// Return the response as JSON
echo json_encode($cars, JSON_PRETTY_PRINT);

// Close statement and database connection
$stmt->close();
$conn->close();