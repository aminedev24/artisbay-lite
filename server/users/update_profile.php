<?php

require_once __DIR__ . '/../core/db_connection.php';
require_once __DIR__ . '/../core/headers.php';
// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

try {

    // Log incoming request details
    error_log("Incoming request method: " . $_SERVER['REQUEST_METHOD']);
    error_log("Request body: " . file_get_contents('php://input'));

    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        error_log("User not logged in");
        http_response_code(401);
        throw new Exception('User not logged in');
    }

    // Get user ID from session
    $user_id = $_SESSION['user_id'];

    // Get the updated data from the request
    $data = json_decode(file_get_contents('php://input'), true);

    // Log received data
    error_log("Received data: " . print_r($data, true));

    // Validate that only one field is being updated
    $updatableFields = ['company', 'full_name', 'country', 'address'];
    $updateField = null;
    $updateValue = null;

    foreach ($updatableFields as $field) {
        if (isset($data[$field])) {
            $updateField = $field;
            $updateValue = trim($data[$field]);
            break;
        }
    }

    // Validate the field
    if (!$updateField) {
        error_log("No valid field to update");
        http_response_code(400);
        throw new Exception('No valid field to update');
    }

    // Validation rules
    $errors = [];

    // Field-specific validations
    switch ($updateField) {
        case 'full_name':
            if (empty($updateValue)) {
                $errors[] = 'Name cannot be empty';
            }
            if (strlen($updateValue) < 2) {
                $errors[] = 'Name must be at least 2 characters long';
            }
            break;

        case 'company':
            if (strlen($updateValue) > 100) {
                $errors[] = 'Company name is too long';
            }
            break;

        case 'country':
            if (empty($updateValue)) {
                $errors[] = 'Country cannot be empty';
            }
            break;
    }

    // If there are errors, return them
    if (!empty($errors)) {
        error_log("Validation errors: " . implode(', ', $errors));
        http_response_code(400);
        throw new Exception(implode(', ', $errors));
    }

    // Sanitize input
    $updateValue = htmlspecialchars($updateValue, ENT_QUOTES, 'UTF-8');

    // Prepare the SQL statement to update specific field
    $sql = "UPDATE users SET `$updateField` = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        error_log("SQL prepare failed: " . $conn->error);
        http_response_code(500);
        throw new Exception('SQL prepare failed: ' . $conn->error);
    }

    $stmt->bind_param("si", $updateValue, $user_id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        // Fetch the updated user data to return
        $stmt->close();

        if ($updateField === 'full_name') {
            $_SESSION['full_name'] = $updateValue;
        }
        
        // Fetch all user details
        $sql = "SELECT full_name, email, phone, country, company, joined_date FROM users WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            echo json_encode($user);
        } else {
            error_log("User not found");
            http_response_code(404);
            throw new Exception('User not found');
        }
    } else {
        error_log("No changes made or user not found");
        http_response_code(304);
        throw new Exception('No changes made or user not found');
    }

} catch (Exception $e) {
    // Log the full exception
    error_log("Exception: " . $e->getMessage());
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    // Ensure database connections are closed
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
}
?>