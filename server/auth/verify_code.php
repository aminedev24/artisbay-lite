<?php
session_start();
require_once __DIR__ . '/../core/db_connection.php';
require_once __DIR__ . '/../core/headers.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$code = $data['code'] ?? '';

if (!$email || !$code) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing email or code."]);
    exit;
}

$stmt = $conn->prepare("SELECT id, uid, full_name, email, role, verification_code, verification_attempts FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($id, $uid, $fullName, $emailFromDb, $role, $verification_code, $attempts);
    $stmt->fetch();

    if ($role === 'admin') {
        if ($attempts >= 5) {
            http_response_code(429);
            echo json_encode(["status" => "error", "message" => "Too many failed attempts. Please request a new code."]);
            exit;
        }

        if ($verification_code == $code) {
            // Mark session as verified
            $_SESSION['admin_verified'] = true;
            // Set session variables so the user is considered logged in
            $_SESSION['user_id'] = $id;
            $_SESSION['full_name'] = $fullName;
            $_SESSION['uid'] = $uid;
            $_SESSION['email'] = $emailFromDb;
            $_SESSION['role'] = $role;
            // Clear the code and attempts from DB
            $clear = $conn->prepare("UPDATE users SET verification_code = NULL, verification_token = NULL, verification_attempts = 0 WHERE id = ?");
            $clear->bind_param("i", $id);
            $clear->execute();
            $clear->close();

            echo json_encode(["status" => "success", "message" => "Verification successful."]);
        } else {
            // Increment attempts
            $newAttempts = $attempts + 1;
            $updateAttempts = $conn->prepare("UPDATE users SET verification_attempts = ? WHERE id = ?");
            $updateAttempts->bind_param("ii", $newAttempts, $id);
            $updateAttempts->execute();
            $updateAttempts->close();

            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Invalid verification code. Attempts left: " . (5 - $newAttempts)]);
        }
    } else {
        // For non-admin, no attempt limit, but still check code
        if ($verification_code == $code) {
            // Similar to admin success
            $_SESSION['admin_verified'] = true;
            $_SESSION['user_id'] = $id;
            $_SESSION['full_name'] = $fullName;
            $_SESSION['uid'] = $uid;
            $_SESSION['email'] = $emailFromDb;
            $_SESSION['role'] = $role;
            $clear = $conn->prepare("UPDATE users SET verification_code = NULL, verification_token = NULL WHERE id = ?");
            $clear->bind_param("i", $id);
            $clear->execute();
            $clear->close();

            echo json_encode(["status" => "success", "message" => "Verification successful."]);
        } else {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Invalid verification code."]);
        }
    }
} else {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "User not found."]);
}
$stmt->close();
$conn->close();
?>