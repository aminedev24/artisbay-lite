<?php
session_start();
require_once __DIR__ . '/../core/db_connection.php';
require_once __DIR__ . '/../core/headers.php';

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $agreementType = $_GET['agreementType'] ?? ''; // Get agreementType from query parameters

    // Query to check if the user has already agreed to the specific agreement type
    $stmt = $conn->prepare("SELECT * FROM agreements WHERE user_id = ? AND agreement_type = ?");
    $stmt->bind_param("is", $user_id, $agreementType);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(["already_agreed" => true]);
    } else {
        echo json_encode(["already_agreed" => false]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "User not logged in"]);
}
?>