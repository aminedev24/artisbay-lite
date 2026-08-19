<?php
// rate.php

require_once __DIR__ . '/../core/db_connection.php';
require_once __DIR__ . '/../core/headers.php';


header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch the current USD/JPY rate
    $sql = "SELECT usdToYen FROM rates LIMIT 1";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(["usdToYen" => floatval($row['usdToYen'])]);
    } else {
        // No rate found, insert default value
        $defaultRate = 155.00;
        $insertSql = "INSERT INTO rates (usdToYen) VALUES (?)";
        $stmt = $conn->prepare($insertSql);
        $stmt->bind_param("d", $defaultRate);

        if ($stmt->execute()) {
            echo json_encode(["usdToYen" => $defaultRate]);
        } else {
            echo json_encode(["error" => "Failed to initialize rate"]);
        }
        $stmt->close();
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Save or update the USD/JPY rate
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data['usdToYen'])) {
        echo json_encode(["error" => "Invalid input"]);
        exit;
    }

    $usdToYen = floatval($data['usdToYen']);

    // Check if any row exists
    $checkSql = "SELECT COUNT(*) as count FROM rates";
    $checkResult = $conn->query($checkSql);
    $row = $checkResult->fetch_assoc();

    if ($row['count'] > 0) {
        // Update existing row
        $sql = "UPDATE rates SET usdToYen = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("d", $usdToYen);
    } else {
        // Insert new row
        $sql = "INSERT INTO rates (usdToYen) VALUES (?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("d", $usdToYen);
    }

    if (!$stmt) {
        echo json_encode(["error" => "Prepare failed: " . $conn->error]);
        exit;
    }

    if ($stmt->execute()) {
        echo json_encode([
            "message" => $row['count'] > 0 ? "Rate updated successfully" : "Rate inserted successfully",
            "usdToYen" => $usdToYen
        ]);
    } else {
        echo json_encode(["error" => "Operation failed: " . $stmt->error]);
    }

    $stmt->close();

} else {
    echo json_encode(["error" => "Unsupported request method"]);
}

$conn->close();
?>