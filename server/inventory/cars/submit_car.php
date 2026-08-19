<?php
session_start();
require_once __DIR__ . '/../../core/db_connection.php';
require_once __DIR__ . '/../../core/headers.php';
// Accept JSON
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
  http_response_code(400);
  echo json_encode(["status" => "error", "message" => "Invalid input data."]);
  exit();
}

// --- Delete action (own-stock vehicles) -------------------------------
$action = $data['action'] ?? 'create';
if ($action === 'delete') {
  // Accept a single id or a batch of ids (bulk delete).
  $ids = [];
  if (isset($data['ids']) && is_array($data['ids'])) {
    foreach ($data['ids'] as $rawId) {
      $ids[] = (int)$rawId;
    }
  } else {
    $ids[] = (int)($data['id'] ?? 0);
  }
  $ids = array_values(array_unique(array_filter($ids, fn($id) => $id > 0)));
  if (empty($ids)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Vehicle id is required."]);
    exit();
  }

  $deleted = 0;
  $notFound = 0;
  foreach ($ids as $id) {
    $stmt = $conn->prepare("SELECT ref_no FROM cars_stock WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();

    if (!$row) {
      // Sold vehicles live in cars_inventory.
      $stmt = $conn->prepare("SELECT ref_no FROM cars_inventory WHERE id = ?");
      $stmt->bind_param('i', $id);
      $stmt->execute();
      $row = $stmt->get_result()->fetch_assoc();

      if (!$row) {
        $notFound++;
        continue;
      }

      $delStmt = $conn->prepare("DELETE FROM cars_inventory WHERE id = ?");
      $delStmt->bind_param('i', $id);
      $delStmt->execute();
      $deleted++;
      continue;
    }

    // Cancel any active reservation for the deleted vehicle.
    $cancelStmt = $conn->prepare("UPDATE reserved_vehicles SET status = 'cancelled' WHERE vehicle_ref = ? AND status = 'reserved'");
    $cancelStmt->bind_param('s', $row['ref_no']);
    $cancelStmt->execute();

    $delStmt = $conn->prepare("DELETE FROM cars_stock WHERE id = ?");
    $delStmt->bind_param('i', $id);
    $delStmt->execute();
    $deleted++;
  }

  $message = "Vehicle deleted.";
  if (count($ids) > 1) {
    $message = "$deleted vehicle(s) deleted.";
    if ($notFound > 0) $message .= " $notFound not found.";
  }
  echo json_encode(["status" => "success", "message" => $message, "deleted" => $deleted]);
  $conn->close();
  exit();
}

// Basic validation
if (empty($data['refNo']) || empty($data['make']) || empty($data['model']) || empty($data['targetTable'])) {
  http_response_code(400);
  echo json_encode(["status" => "error", "message" => "Invalid input data."]);
  exit();
}

$allowedTables = ['cars_inventory', 'cars_stock'];
$targetTable   = $data['targetTable'];
if (!in_array($targetTable, $allowedTables)) {
  http_response_code(400);
  echo json_encode(["status" => "error", "message" => "Invalid target table."]);
  exit();
}

// Normalize optional date fields to NULL when blank
foreach (['invoice_date', 'ship_date'] as $dateField) {
  $rawValue = $data[$dateField] ?? null;
  if ($rawValue === null) {
    $data[$dateField] = null;
    continue;
  }

  if (is_string($rawValue)) {
    $rawValue = trim($rawValue);
  }

  $data[$dateField] = $rawValue === '' ? null : $rawValue;
}

/**
 * Normalize decimal numbers for double columns.
 *
 * @param mixed $value
 * @return float
 */
$sanitizeDecimal = function ($value) {
  if ($value === null) {
    return 0.0;
  }

  if (is_string($value)) {
    $value = trim($value);
  }

  if ($value === '' || strtoupper((string)$value) === 'NULL') {
    return 0.0;
  }

  $normalized = preg_replace('/[^\d\.\-]/', '', (string)$value);
  if ($normalized === '' || $normalized === '-' || $normalized === '.') {
    return 0.0;
  }

  return (float)$normalized;
};

$sanitizeInt = function ($value) {
  if ($value === null) {
    return 0;
  }
  if (is_string($value)) {
    $value = trim($value);
  }
  if ($value === '' || strtoupper((string)$value) === 'NULL') {
    return 0;
  }
  $normalized = preg_replace('/[^\d\-]/', '', (string)$value);
  if ($normalized === '' || $normalized === '-') {
    return 0;
  }
  return (int)$normalized;
};

$stringValue = function ($value) {
  if ($value === null) {
    return '';
  }
  if (is_bool($value)) {
    return $value ? '1' : '0';
  }
  return is_scalar($value) ? trim((string)$value) : '';
};

$status        = $stringValue($data['status'] ?? 'in_stock');
$refNo         = $stringValue($data['refNo'] ?? '');
$make          = $stringValue($data['make'] ?? '');
$model         = $stringValue($data['model'] ?? '');
$price         = $stringValue($data['price'] ?? '');
$invoiceDate   = $data['invoice_date'] ?? null;
$category      = $stringValue($data['category'] ?? '');
$color         = $stringValue($data['color'] ?? '');
$year          = $stringValue($data['year'] ?? '');
$dimension     = $stringValue($data['dimension'] ?? '');
$m3            = $stringValue($data['m3'] ?? '');
$engineCapacity= $stringValue($data['engineCapacity'] ?? '');
$mileage       = $stringValue($data['mileage'] ?? '');
$chassisNo     = $stringValue($data['chassisNo'] ?? '');
$fuel          = $stringValue($data['fuel'] ?? '');
$door          = $stringValue($data['door'] ?? '');
$seat          = $stringValue($data['seat'] ?? '');
$transmission  = $stringValue($data['transmission'] ?? '');
$drive         = $stringValue($data['drive'] ?? '');
$stereo        = $stringValue($data['stereo'] ?? '');
$freight       = $stringValue($data['freight'] ?? '');
$finalValue    = $stringValue($data['final_value'] ?? '');
$discount      = $stringValue($data['discount'] ?? '');
$userName      = $stringValue($data['user_name'] ?? '');
$portDischarge = $stringValue($data['port_of_discharge'] ?? '');
$portLoading   = $stringValue($data['port_of_loading'] ?? '');
$engineType    = $stringValue($data['engine_type'] ?? '');
$destination   = $stringValue($data['destination'] ?? '');
$departurePort = $stringValue($data['departure_port'] ?? '');
$address       = $stringValue($data['address'] ?? '');
$phone         = $stringValue($data['phone'] ?? '');
$company       = $stringValue($data['company'] ?? '');
$userId        = $sanitizeInt($data['user_id'] ?? 0);
$createdBy     = $sanitizeInt($_SESSION['user_id'] ?? 0);
$imageUrls     = $data['image_urls'] ?? '[]';
$mainCurrency  = $stringValue($data['mainCurrency'] ?? '');
$size          = $stringValue($data['size'] ?? '');
$shipName      = $stringValue($data['ship_name'] ?? '');
$shipDate      = $data['ship_date'] ?? null;
$arrivalPort   = $stringValue($data['arrival_port'] ?? '');

$buyingPrice    = $sanitizeDecimal($data['buyingPrice'] ?? 0);
$auctionFee     = $sanitizeDecimal($data['auctionFee'] ?? 0);
$transportation = $sanitizeDecimal($data['transportation'] ?? 0);
$yardFee        = $sanitizeDecimal($data['yardFee'] ?? 0);
$photosFee      = $sanitizeDecimal($data['photosFee'] ?? 0);
$othersFee      = $sanitizeDecimal($data['othersFee'] ?? 0);
$serviceFee     = $sanitizeDecimal($data['serviceFee'] ?? 0);
$taxValue       = $sanitizeDecimal($data['tax'] ?? 0);
$fobValue       = $sanitizeDecimal($data['fob'] ?? 0);

$steering  = $stringValue($data['steering'] ?? '');
$modelCode = $stringValue($data['model_code'] ?? '');

// Options are stored as a JSON array string (matching the partner feed and the
// details-page parser). Accept an array, an already-JSON string, or a bare
// comma-separated string and normalize it to JSON.
$optionsValue = function ($value) {
    if ($value === null) return '';
    if (is_array($value)) {
        $clean = array_values(array_filter($value, function ($o) {
            return trim((string)$o) !== '';
        }));
        return json_encode($clean);
    }
    $raw = trim((string)$value);
    if ($raw === '') return '';
    if ($raw[0] === '[') return $raw;
    if (strpos($raw, ',') !== false) {
        return json_encode(array_values(array_filter(array_map('trim', explode(',', $raw)), 'strlen')));
    }
    return $raw;
};
$options = $optionsValue($data['options'] ?? null);

// Prepare SQL with new cost columns - now 52 parameters
$sql = "INSERT INTO $targetTable
(ref_no, make, model, price, invoice_date, category, color, year, dimension, m3, engine_capacity, mileage, chassis_no,
fuel, door, seat, transmission, drive, stereo, freight, final_value, discount, user_name, port_of_discharge,
port_of_loading, engine_type, destination, departure_port, address, phone, company, user_id, created_by, image_urls,
currency, size, ship_name, ship_date, arrival_port, steering, model_code, options, status,
buying_price, auction_fee, transportation, yard_fee, photos_fee, others_fee, service_fee, tax, fob, created_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())"; // 52 placeholders + NOW()
$stmt = $conn->prepare($sql);
if (!$stmt) {
  http_response_code(500);
  echo json_encode(["status" => "error", "message" => "DB prepare failed: " . $conn->error]);
  exit();
}

// 52 placeholders with strict numeric typing
$stmt->bind_param(
  implode('', [
    's','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','s','i','i','s','s','s','s','s','s','s','s','s','s','d','d','d','d','d','d','d','d','d'
  ]),
  $refNo,
  $make,
  $model,
  $price,
  $invoiceDate,
  $category,
  $color,
  $year,
  $dimension,
  $m3,
  $engineCapacity,
  $mileage,
  $chassisNo,
  $fuel,
  $door,
  $seat,
  $transmission,
  $drive,
  $stereo,
  $freight,
  $finalValue,
  $discount,
  $userName,
  $portDischarge,
  $portLoading,
  $engineType,
  $destination,
  $departurePort,
  $address,
  $phone,
  $company,
  $userId,
  $createdBy,
  $imageUrls,
  $mainCurrency,
  $size,
  $shipName,
  $shipDate,
  $arrivalPort,
  $steering,
  $modelCode,
  $options,
  $status,
  $buyingPrice,
  $auctionFee,
  $transportation,
  $yardFee,
  $photosFee,
  $othersFee,
  $serviceFee,
  $taxValue,
  $fobValue
);

if ($stmt->execute()) {
  echo json_encode(["status" => "success", "message" => "Car data saved successfully."]);
} else {
  http_response_code(500);
  echo json_encode(["status" => "error", "message" => "DB execute failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>  
