<?php
session_start();

require_once __DIR__ . '/../core/db_connection.php';
require_once __DIR__ . '/../core/headers.php';

// Check if user is logged in and full_name is set
if (!isset($_SESSION['user_id']) || !isset($_SESSION['full_name'])) {
    error_log("User not logged in or full_name not set in session.");
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];
$name = $_SESSION['full_name'];
error_log("User ID: " . $user_id);
error_log("User full_name: " . $name);

// 1. Try to get user info from users table first
$userSql = "SELECT full_name, email, phone, country, joined_date, company, is_verified, address FROM users WHERE id = ?";
$userStmt = $conn->prepare($userSql);
if ($userStmt === false) {
    error_log("User SQL prepare failed: " . $conn->error);
    die(json_encode(['error' => 'SQL prepare failed: ' . $conn->error]));
}
$userStmt->bind_param("i", $user_id);
$userStmt->execute();
$userResult = $userStmt->get_result();

if ($userResult->num_rows > 0) {
    $user = $userResult->fetch_assoc();
    error_log("User found in 'users' table: " . print_r($user, true));
} else {
    // Not found in users, fallback to customers using full name
    error_log("User not found in 'users' table. Trying 'customers' by customer_name...");

    $customerSql = "SELECT 
                        customer_name AS full_name, 
                        email1 AS email, 
                        tel1 AS phone, 
                        country, 
                        registration_date AS joined_date, 
                        customer_category AS company, 
                        is_verified, 
                        consignee_address AS address 
                    FROM customers 
                    WHERE customer_name = ? 
                    LIMIT 1";
    $customerStmt = $conn->prepare($customerSql);
    if ($customerStmt === false) {
        error_log("Customer SQL prepare failed: " . $conn->error);
        die(json_encode(['error' => 'SQL prepare failed: ' . $conn->error]));
    }

    $customerStmt->bind_param("s", $name);
    $customerStmt->execute();
    $customerResult = $customerStmt->get_result();

    if ($customerResult->num_rows > 0) {
        $user = $customerResult->fetch_assoc();
        error_log("User found in 'customers' table: " . print_r($user, true));
    } else {
        error_log("User not found in either 'users' or 'customers' table for name: " . $name);
        echo json_encode(['error' => 'User not found']);
        exit;
    }
    $customerStmt->close();
}
$userStmt->close();


// 2. Retrieve totals for spending, guaranty, and extra_guaranty grouped by currency from deposits table
$depositsSql = "
    SELECT 
        currency, 
        IFNULL(SUM(amount), 0) AS total_spending,
        IFNULL(SUM(CASE WHEN consumption_type = 'guaranty' THEN consumption_value ELSE 0 END), 0) AS total_guaranty,
        IFNULL(SUM(CASE WHEN consumption_type = 'extra_guaranty' THEN consumption_value ELSE 0 END), 0) AS total_extra_guaranty 
    FROM deposits 
    WHERE name = ? 
    GROUP BY currency";
    
$depositsStmt = $conn->prepare($depositsSql);
if ($depositsStmt === false) {
    error_log("Deposits SQL prepare failed: " . $conn->error);
    die(json_encode(['error' => 'SQL prepare failed: ' . $conn->error]));
}
$depositsStmt->bind_param("s", $name);
$depositsStmt->execute();
$depositsResult = $depositsStmt->get_result();

$totalByCurrency = [];
if ($depositsResult) {
    error_log("Deposits result row count: " . $depositsResult->num_rows);
    while ($row = $depositsResult->fetch_assoc()) {
        error_log("Deposits row: " . print_r($row, true));
        if (isset($row['currency'])) {
            $currency = $row['currency'];
            // Format each total using number_format for thousand separators
            $formattedSpending      = number_format($row['total_spending'], 0, '', ',') . $currency;
            $formattedGuaranty      = number_format($row['total_guaranty'], 0, '', ',') . $currency;
            $formattedExtraGuaranty = number_format($row['total_extra_guaranty'], 0, '', ',') . $currency;
            $totalByCurrency[$currency] = [
                'spending'       => $formattedSpending,
                'guaranty'       => $formattedGuaranty,
                'extra_guaranty' => $formattedExtraGuaranty
            ];
        } else {
            error_log("Expected key 'currency' not found in row: " . print_r($row, true));
        }
    }
} else {
    error_log("No deposits rows returned for name: " . $name);
}
$depositsStmt->close();

// 3. Combine user information and the formatted totals into one response
$response = array_merge($user, ['total_by_currency' => $totalByCurrency]);
error_log("Final response: " . print_r($response, true));

// Return the combined response as JSON
echo json_encode($response, JSON_PRETTY_PRINT);

// Close the database connection
$conn->close();
?>
