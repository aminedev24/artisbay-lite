<?php
session_start();
require_once __DIR__ . '/../../core/db_connection.php';
require_once __DIR__ . '/../../core/headers.php';

// Ensure user_id is set in the session
if (!isset($_SESSION['user_id'])) {
    error_log("Unauthorized access attempt. User ID not found in session.");
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized access. User ID not found in session."]);
    exit();
}

$user_id = $_SESSION['user_id'];

// Prepare SQL statement to fetch submitted cars for this user
$sql = "SELECT 
            currency,user_name,ref_no, make, model, price,size, category, color, year, dimension, m3, engine_capacity, 
            mileage, chassis_no, fuel, door, seat, transmission, drive, stereo, freight, discount, final_value, user_name, 
            port_of_discharge, port_of_loading, engine_type, destination, departure_port, address, phone, company, 
            image_urls,ship_name,ship_date,arrival_port
        FROM cars_inventory
        WHERE user_id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    error_log("Database error: Failed to prepare statement. Error: " . $conn->error);
    http_response_code(500);
    echo json_encode(["error" => "Internal server error."]);
    exit();
}

$stmt->bind_param("i", $user_id);

if (!$stmt->execute()) {
    error_log("Database error: Failed to execute statement. Error: " . $stmt->error);
    http_response_code(500);
    echo json_encode(["error" => "Internal server error."]);
    exit();
}

$result = $stmt->get_result();

$cars = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        if (isset($row['image_urls'])) {
            $row['image_urls'] = json_decode($row['image_urls'], true);
        }
        $cars[] = $row;
    }
} else {
    error_log("No submitted cars found for user ID: " . $user_id);
}

// Return the response as JSON
echo json_encode($cars, JSON_PRETTY_PRINT);

$stmt->close();
$conn->close();
?>