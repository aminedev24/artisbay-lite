<?php
// server/getUserInfo.php
session_start();


// Allowed Origins (CORS)
$allowedOrigins = ['http://localhost:3000', 'https://artisbay.com'];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header("Access-Control-Allow-Credentials: true");

// Check if the user is logged in (assuming user_id is stored in session)
if (isset($_SESSION['user_id'])) {
    // Assuming you have a database connection setup
    require_once __DIR__ . '/../core/db_connection.php';
    // Fetch user information from the database
    $user_id = $_SESSION['user_id'];
    $sql = "SELECT full_name, country, email, phone, company,address FROM users WHERE id = ?";
    
    try {
        // Prepare and execute the query
        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("i", $user_id); // Bind user ID to the query
            $stmt->execute();
            $result = $stmt->get_result();

            // Check if user data is found
            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();
                // Return the user data as JSON
                echo json_encode([
                    'status' => 'success',
                    'data' => $user
                ]);
            } else {
                // If no user data is found
                error_log("User data not found for user_id: $user_id");
                echo json_encode([
                    'status' => 'error',
                    'message' => 'User data not found'
                ]);
            }
        } else {
            // Query preparation failed
            error_log("Failed to prepare query: " . $conn->error);
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to prepare query'
            ]);
        }
    } catch (Exception $e) {
        // Catch any unexpected errors
        error_log("Exception occurred: " . $e->getMessage());
        echo json_encode([
            'status' => 'error',
            'message' => 'An unexpected error occurred'
        ]);
    }

    $conn->close(); // Close the DB connection
} else {
    // User is not logged in
    error_log("User not logged in. Session user_id not set.");
    echo json_encode([
        'status' => 'error',
        'message' => 'User not logged in'
    ]);
}
?>
