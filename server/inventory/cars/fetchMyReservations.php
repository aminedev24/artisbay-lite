<?php

// Customer-facing reservations & orders for the logged-in user's profile.
// Mirrors ichinomiya's "My Reservations" / "My Orders" tabs:
//   reservations = active holds (reserved / pending_payment)
//   orders       = anything progressed past the hold stage

session_start();
require_once __DIR__ . '/../../core/db_connection.php';
require_once __DIR__ . '/../../core/db_migrations.php';
require_once __DIR__ . '/../../core/headers.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Please log in to view your reservations."]);
    exit;
}
$userId = (int)$_SESSION['user_id'];

// Release holds that expired so the customer profile shows them as orders
// instead of active reservations.
require_once __DIR__ . '/reservation_helpers.php';
releaseExpiredReservations($conn);

// Guard columns added by other reservation paths so this always works
// regardless of which script created the table first.
ensure_columns($conn, 'reserved_vehicles', [
    'agreed_price' => 'DECIMAL(15,2) DEFAULT 0',
    'expires_at' => 'DATETIME DEFAULT NULL',
]);

$sql = "SELECT
            rv.id,
            rv.vehicle_ref,
            rv.make,
            rv.model,
            rv.destination_country,
            rv.deposit_amount,
            rv.deposit_currency,
            rv.payment_plan,
            COALESCE(NULLIF(rv.agreed_price, 0), c.price, 0) AS price,
            COALESCE(c.currency, rv.deposit_currency, 'USD') AS currency,
            rv.expires_at,
            rv.status,
            rv.created_at,
            c.status AS vehicle_status,
            c.image_urls AS image
        FROM reserved_vehicles rv
        LEFT JOIN cars_stock c ON c.ref_no COLLATE utf8mb4_general_ci = rv.vehicle_ref
        WHERE rv.user_id = ?
        ORDER BY rv.id DESC";

$stmt = $conn->prepare($sql);
if ($stmt === false) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to prepare reservations query."]);
    exit;
}
$stmt->bind_param('i', $userId);
$stmt->execute();
$result = $stmt->get_result();

$reservations = [];
$orders = [];
while ($row = $result->fetch_assoc()) {
    $row['currency'] = $row['currency'] ?: 'USD';
    $row['price'] = (float)($row['price'] ?? 0);
    $row['deposit_amount'] = (float)($row['deposit_amount'] ?? 0);

    $status = $row['status'] ?? 'reserved';
    if (in_array($status, ['reserved', 'pending_payment'], true)) {
        $reservations[] = $row;
    } else {
        $orders[] = $row;
    }
}

echo json_encode([
    "status" => "success",
    "reservations" => $reservations,
    "orders" => $orders,
]);
$conn->close();
