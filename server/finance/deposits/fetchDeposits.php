<?php
session_start(); // Start the session

require_once __DIR__ . '/../../core/db_connection.php';
require_once __DIR__ . '/../../core/headers.php';

if (!isset($_SESSION['full_name'])) {
    echo json_encode(["error" => "Unauthorized. Please log in."]);
    exit;
}

$user_id = $_SESSION['full_name']; // Get user ID from session

// Include the "conversions" column in your SELECT query
$sql = "SELECT id, name, amount, currency, remitter, consumption_type, consumption_value, leftover, note, swift_details, staff, rate, date, conversions 
        FROM deposits 
        WHERE name = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$deposits = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // If conversions is stored as JSON, you might decode it here if needed:
        // $row['conversions'] = json_decode($row['conversions'], true);
        $deposits[] = $row;
    }
}

$stmt->close();
$conn->close();

echo json_encode($deposits);
?>
