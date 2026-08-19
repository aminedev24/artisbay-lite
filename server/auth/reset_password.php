<?php
require_once __DIR__ . '/../core/db_connection.php';
require_once __DIR__ . '/../core/headers.php';
// If it's a preflight request (OPTIONS), send a 200 response without processing further
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read the raw POST data (JSON body)
    $input = json_decode(file_get_contents('php://input'), true);

    // Check if the token and password are provided in the body
    $token = isset($input['token']) ? $input['token'] : '';
    $newPassword = isset($input['password']) ? $input['password'] : '';

    if (empty($token) || empty($newPassword)) {
        echo json_encode(['status' => 'error', 'message' => 'Token or password is missing.']);
        exit;
    }

    // Validate token
    $query = $conn->prepare("SELECT user_id, expires_at FROM password_resets WHERE token = ?");
    $query->bind_param("s", $token);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        $reset = $result->fetch_assoc();
        if (strtotime($reset['expires_at']) > time()) {
            // Update the user's password
            $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
            $update = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
            $update->bind_param("si", $hashedPassword, $reset['user_id']);
            $update->execute();

            // Delete the token
            $delete = $conn->prepare("DELETE FROM password_resets WHERE token = ?");
            $delete->bind_param("s", $token);
            $delete->execute();

            echo json_encode(['status' => 'success', 'message' => 'Password updated successfully.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Token expired.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid token.']);
    }
}
?>
