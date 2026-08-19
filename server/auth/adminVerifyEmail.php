<?php
session_start();
require_once __DIR__ . '/../core/db_connection.php';
require_once __DIR__ . '/../core/headers.php';

if (isset($_GET['token'])) {
    $token = $_GET['token'];

    // Look up the user by token (regardless of is_verified status)
    $stmt = $conn->prepare("SELECT id, is_verified FROM users WHERE verification_token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 1) {
        $stmt->bind_result($id, $isVerified);
        $stmt->fetch();

        // If not yet verified, update the record
        if ($isVerified != 1) {
            $updateStmt = $conn->prepare("UPDATE users SET is_verified = 1 WHERE id = ?");
            $updateStmt->bind_param("i", $id);
            $updateStmt->execute();
            $updateStmt->close();
        }
        
        // Retrieve user details for login
        $userStmt = $conn->prepare("SELECT id, uid, full_name, email, role FROM users WHERE id = ?");
        $userStmt->bind_param("i", $id);
        $userStmt->execute();
        $userStmt->bind_result($userId, $uid, $fullName, $emailFromDb, $role);
        $userStmt->fetch();
        $userStmt->close();
        
        // Set session variables so the user is considered logged in
        $_SESSION['user_id'] = $userId;
        $_SESSION['full_name'] = $fullName;
        $_SESSION['uid'] = $uid;
        $_SESSION['email'] = $emailFromDb;
        $_SESSION['role'] = $role;

        // You can also set a flag if needed:
        $updateSession = $conn->prepare("INSERT INTO user_sessions (uid, user_name,user_id, is_logged_in, last_login)
        VALUES (?, ?,?, TRUE, NOW())
        ON DUPLICATE KEY UPDATE is_logged_in = TRUE, last_login = NOW()");
        $updateSession->bind_param("sss", $uid, $fullName,$id);
        if (!$updateSession->execute()) {
            echo json_encode(["status" => "error", "message" => "Database error: " . $updateSession->error]);
        }
        $updateSession->close();
        $_SESSION['admin_verified'] = true;
        
        echo json_encode([
            "status" => "success",
            "message" => "Your email has been verified and you are now logged in.",
            "user" => [
                "id" => $userId,
                "uid" => $uid,
                "name" => $fullName,
                "email" => $emailFromDb,
                "role" => $role
            ]
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid or expired token."
        ]);
    }
    $stmt->close();
} else {
    echo json_encode([
        "status" => "error",
        "message" => "No token provided."
    ]);
}
$conn->close();
?>
