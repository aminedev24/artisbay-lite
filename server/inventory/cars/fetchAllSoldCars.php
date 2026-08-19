<?php
session_start();
require_once __DIR__ . '/../../core/db_connection.php';
require_once __DIR__ . '/../../core/headers.php';
// Only allow admin access
if (!isset($_SESSION['user_id'])) {
    error_log("Unauthorized access attempt. User not logged in.");
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized access. Please login."]);
    exit();
}

// Check if user is admin
if ($_SESSION['role'] !== 'admin') {
    error_log("Unauthorized access attempt. User is not admin.");
    http_response_code(403);
    echo json_encode(["error" => "Forbidden. Admin access required."]);
    exit();
}

try {
    // Prepare SQL statement to fetch ALL cars (removed status filter)
    $sql = "SELECT 
                id, currency, user_id, user_name, ref_no, make, model, price, invoice_date, size, category, color, year, dimension, m3, 
                engine_capacity, mileage, chassis_no, fuel, door, seat, transmission, drive, stereo, freight, discount, 
                port_of_discharge, port_of_loading, engine_type, destination, departure_port, address, phone, 
                company, image_urls, ship_name, ship_date, arrival_port
            FROM cars_inventory
            ORDER BY id DESC";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }

    if (!$stmt->execute()) {
        throw new Exception("Failed to execute statement: " . $stmt->error);
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
    }

    // Return the response as JSON
    echo json_encode([
        'success' => true,
        'data' => $cars
    ]);

} catch (Exception $e) {
    error_log("Error in fetchAllSoldCars.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Internal server error',
        'details' => $e->getMessage() // Only include in development
    ]);
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
}
?>
