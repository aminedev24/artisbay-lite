<?php
require_once __DIR__ . '/../core/db_connection.php';
require_once __DIR__ . '/../core/headers.php';

if (!isset($_GET['token'])) {
    echo json_encode(["status" => "error", "message" => "Missing token."]);
    exit;
}

$token = $_GET['token'];

// Look up the token in the email_verifications table
$stmt = $conn->prepare("SELECT user_id, expires_at FROM email_verifications WHERE token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Invalid or expired token."]);
    exit;
}

$row = $result->fetch_assoc();

// Check if the token has expired
$currentDate = new DateTime();
$expiresAt = new DateTime($row['expires_at']);

if ($currentDate > $expiresAt) {
    echo json_encode(["status" => "error", "message" => "Token expired."]);
    exit;
}

// Token is valid, update the respective table
$userId = $row['user_id'];

// Check if the user_id exists in the users table
$stmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$userResult = $stmt->get_result();

if ($userResult->num_rows > 0) {
    // Update the users table if the user exists
    $stmt = $conn->prepare("UPDATE users SET is_verified = 1 WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    echo json_encode(["status" => "success", "message" => "Email verified successfully for user."]);
} else {
    // If the user is not found in users table, check the customers table
    $stmt = $conn->prepare("SELECT customer_id FROM customers WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $customerResult = $stmt->get_result();

    if ($customerResult->num_rows > 0) {
        // Update the customers table if the user_id corresponds to a customer
        $stmt = $conn->prepare("UPDATE customers SET is_verified = 1 WHERE id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        echo json_encode(["status" => "success", "message" => "Email verified successfully for customer."]);
    } else {
        echo json_encode(["status" => "error", "message" => "No associated user or customer found."]);
    }
}

exit;
?>
