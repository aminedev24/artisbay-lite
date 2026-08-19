<?php
session_start();
require_once __DIR__ . '/../../core/db_connection.php';
require_once __DIR__ . '/../../core/headers.php';

// Own (Artisbay Lite-managed) stock — the main database's cars_stock table,
// merged with sold vehicles from cars_inventory so the Inventory tab also
// shows sold cars. cars_inventory rows whose ref also exists in cars_stock
// are skipped (the cars_stock row already carries the sold status).

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized access. Please login."]);
    exit;
}

// Release holds that expired so the admin list never shows a stale Reserved badge.
require_once __DIR__ . '/reservation_helpers.php';
releaseExpiredReservations($conn);

$status = isset($_GET['status']) ? trim($_GET['status']) : '';

try {
    $cars = [];
    $seenRefs = [];

    $stockRes = $conn->query(
        "SELECT c.*, rv.user_full_name AS buyer_name, rv.user_email AS buyer_email,
                rv.destination_country AS buyer_country, rv.expires_at,
                cu.full_name AS created_by_name
         FROM cars_stock c
         LEFT JOIN reserved_vehicles rv ON rv.vehicle_ref = c.ref_no COLLATE utf8mb4_general_ci AND rv.status = 'reserved'
         LEFT JOIN users cu ON cu.id = c.created_by
         ORDER BY c.id DESC"
    );
    if ($stockRes) {
        while ($row = $stockRes->fetch_assoc()) {
            if ($row['ref_no']) $seenRefs[$row['ref_no']] = true;
            $cars[] = $row;
        }
    }

    $invRes = $conn->query(
        "SELECT i.*, cu.full_name AS created_by_name
         FROM cars_inventory i
         LEFT JOIN users cu ON cu.id = i.created_by
         ORDER BY i.id DESC"
    );
    if ($invRes) {
        while ($row = $invRes->fetch_assoc()) {
            if ($row['ref_no'] && isset($seenRefs[$row['ref_no']])) continue;
            $row['status'] = $row['status'] ?: 'sold';
            $cars[] = $row;
        }
    }

    // Only Artisbay Lite-managed vehicles belong in the Inventory tab.
    // Supplier/partner rows (status NULL) are excluded. Sold cars carry a
    // status like 'sold', 'sold_shipping', 'sold_by_owner' or 'sold_locally'.
    $allowedStatuses = ['in_stock', 'available', 'pending', 'reserved', 'sold'];
    $cars = array_values(array_filter($cars, function ($c) use ($allowedStatuses) {
        $status = strtolower($c['status'] ?? '');
        if (in_array($status, $allowedStatuses, true)) return true;
        return str_starts_with($status, 'sold');
    }));

    if ($status !== '') {
        $cars = array_values(array_filter($cars, function ($c) use ($status) {
            return ($c['status'] ?? '') === $status;
        }));
    }

    echo json_encode($cars);
    $conn->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
