<?php
// MUST be first line with NO whitespace before
header('Content-Type: application/json');

session_start();
require_once __DIR__ . '/../../core/db_connection.php';
require_once __DIR__ . '/../../core/headers.php';

// Verify admin privileges
if (!isset($_SESSION['full_name']) || !isset($_SESSION['role']) || $_SESSION['role'] != 'admin') {
    http_response_code(403);
    die(json_encode(["error" => "Unauthorized. Admin access required."]));
}

try {
    $sql = "SELECT d.id, d.name, d.amount, d.currency, d.remitter, 
                   d.consumption_type, d.consumption_value, d.leftover, 
                   d.note, d.swift_details, d.staff, d.rate, d.date, d.conversions,d.conversion_rates,
                   u.email, u.phone 
            FROM deposits d
            LEFT JOIN users u ON d.name = u.full_name
            ORDER BY d.date DESC";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $result = $stmt->get_result();
    $deposits = $result->fetch_all(MYSQLI_ASSOC);
    
    // Process conversions from JSON string to object
    array_walk($deposits, function(&$deposit) {
        if (isset($deposit['conversions'])) {
            $deposit['conversions'] = json_decode($deposit['conversions'], true);
        }
    });

    echo json_encode($deposits);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
}
?>