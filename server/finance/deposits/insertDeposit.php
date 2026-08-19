<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../core/db_connection.php';
require_once __DIR__ . '/../../core/headers.php';


session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['message' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(['message' => 'No data received']);
    exit;
}

// Retrieve input data
$date = $data['date'];
$amount = (int)$data['amount'];
$remitter = $data['remitter'];
$country = $data['country'];
$currency = $data['selectedCurrency'];
$consumptionType = $data['consumptionType'];
$consumptionValue = $data['consumptionValue'];
$swiftDetails = $data['swiftDetails'];
$note = $data['note'];
$staff = $data['staff'];
$bankFees = $data['bankFees'];
$session_user_id = $_SESSION['user_id'];

// Store both conversions and rates as JSON
$converted_amounts = isset($data['conversions']) ? json_encode($data['conversions']) : null;
$conversion_rates = isset($data['rates']) ? json_encode($data['rates']) : null;

// Handle customer selection
if (empty($data['user_id']) || $data['user_id'] === 'new') {
    $other_user = $data['new_user'];
    $customer_name = null;
} else {
    $userStmt = $conn->prepare("SELECT full_name FROM users WHERE id = ?");
    $userStmt->bind_param("i", $data['user_id']);
    $userStmt->execute();
    $userResult = $userStmt->get_result();
    $user = $userResult->fetch_assoc();
    $userStmt->close();
    $customer_name = $user['full_name'];
    $other_user = null;
}

// Update SQL to store both fields
$sql = "INSERT INTO deposits 
        (date, name, amount, remitter, country, currency, consumption_type, 
         consumption_value, swift_details, note, staff, other_user, 
         conversions, conversion_rates, bank_fees, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['message' => 'Prepare failed: ' . $conn->error]);
    exit;
}

$stmt->bind_param(
    "ssisssssssssssii",
    $date,
    $customer_name,
    $amount,
    $remitter,
    $country,
    $currency,
    $consumptionType,
    $consumptionValue,
    $swiftDetails,
    $note,
    $staff,
    $other_user,
    $converted_amounts,  // JSON of converted amounts (e.g., USD: 33.99)
    $conversion_rates,   // JSON of rates used (e.g., USD: 147.12)
    $bankFees,
    $session_user_id
);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Record inserted successfully']);
} else {
    echo json_encode(['message' => 'Error: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>