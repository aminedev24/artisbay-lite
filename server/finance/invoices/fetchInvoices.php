<?php
require_once __DIR__ . '/../../core/db_connection.php';
require_once __DIR__ . '/../../core/headers.php';

session_start(); // Ensure the session is started

// Ensure email is set in the session
if (!isset($_SESSION['email'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(["error" => "Unauthorized access. User email not found in session."]);
    exit();
}

$user_email = $_SESSION['email']; // Get user email from session

// Debugging log for session email
error_log("Fetching invoices for email: " . $user_email);

// Prepare the SQL query to fetch invoice details using email with case sensitivity
$sql = "SELECT invoice_number,make,model, customer_name, email, deposit_amount ,description, created_at, deposit_purpose , vehicle_description,mileage,chasis_number,engine_capacity, deposit_currency
        FROM invoices 
        WHERE BINARY email = ?";

$stmt = $conn->prepare($sql); // Use prepared statements for security

if ($stmt === false) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "Failed to prepare the SQL statement."]);
    exit();
}

// Bind the email parameter to the query
$stmt->bind_param("s", $user_email);

// Execute the statement
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $invoices = [];
    while ($row = $result->fetch_assoc()) {
        $invoices[] = $row; // Add each invoice to the array
    }
    // Log the fetched invoices
    error_log("Fetched invoices: " . json_encode($invoices));

    // Return the data as JSON
    header('Content-Type: application/json');
    echo json_encode($invoices);
} else {
    // Log no invoices found
    error_log("No invoices found for email: " . $user_email);

    // Return an empty JSON array if no invoices found
    header('Content-Type: application/json');
    echo json_encode([]);
}

// Close the statement and database connection
$stmt->close();
$conn->close();
?>
