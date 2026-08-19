<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../core/db_connection.php';
require_once __DIR__ . '/../../core/headers.php';


session_start();

// Verify authentication
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

// Validate required fields
$required = ['id', 'amount', 'currency'];
foreach ($required as $field) {
    if (!isset($data[$field]) || $data[$field] === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
        exit;
    }
}

try {
    // Prepare UPDATE statement
    $sql = "UPDATE deposits SET
            amount = ?,
            currency = ?,
            swift_details = ?,
            note = ?,
            staff = ?,
            consumption_type = ?,
            consumption_value = ?,
            conversions = ?
            WHERE id = ? AND user_id = ?"; // Ensure user owns this record

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    // Convert empty values to NULL
    $swift_details = !empty($data['swift_details']) ? $data['swift_details'] : null;
    $note = !empty($data['note']) ? $data['note'] : null;
    $staff = !empty($data['staff']) ? $data['staff'] : null;
    $consumption_type = !empty($data['consumption_type']) ? $data['consumption_type'] : null;
    $consumption_value = !empty($data['consumption_value']) ? $data['consumption_value'] : null;
    $conversions = !empty($data['conversions']) ? json_encode($data['conversions']) : null;

    $stmt->bind_param(
        "dsssssssii",
        $data['amount'],
        $data['currency'],
        $swift_details,
        $note,
        $staff,
        $consumption_type,
        $consumption_value,
        $conversions,
        $data['id'],
        $_SESSION['user_id'] // Security check
    );

    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    // Verify update occurred
    if ($stmt->affected_rows === 0) {
        throw new Exception("No record updated - check permissions");
    }

    // Fetch updated record
    $selectStmt = $conn->prepare("SELECT * FROM deposits WHERE id = ?");
    $selectStmt->bind_param("i", $data['id']);
    $selectStmt->execute();
    $result = $selectStmt->get_result();
    $updatedDeposit = $result->fetch_assoc();

    // Format response
    $updatedDeposit['conversion_rates'] = json_decode($updatedDeposit['conversion_rates'], true);
    $updatedDeposit['conversions'] = json_decode($updatedDeposit['conversions'], true);

    echo json_encode([
        'success' => true,
        'message' => 'Deposit updated successfully',
        'data' => $updatedDeposit
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage(),
        'error_code' => $e->getCode()
    ]);
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($selectStmt)) $selectStmt->close();
    $conn->close();
}
?>