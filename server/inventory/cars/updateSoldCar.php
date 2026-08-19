<?php
ob_start();
header('Content-Type: application/json');
session_start();
require_once __DIR__ . '/../../core/db_connection.php';
require_once __DIR__ . '/../../core/headers.php';

error_log("updateSoldCar.php accessed.");

// Admin authentication
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    ob_end_clean();
    http_response_code($_SESSION['user_id'] ? 403 : 401);
    echo json_encode(["error" => $_SESSION['user_id'] ? "Forbidden. Admin access required." : "Unauthorized. Please login."]);
    exit();
}

try {
    // Sanitize essential fields
    $refNo = preg_replace('/[^a-zA-Z0-9_-]/', '_', $_POST['ref_no'] ?? '');
    $make = preg_replace('/[^a-zA-Z0-9_-]/', '_', $_POST['make'] ?? '');
    $model = preg_replace('/[^a-zA-Z0-9_-]/', '_', $_POST['model'] ?? '');

    if (empty($refNo) || empty($make) || empty($model)) {
        throw new Exception("Missing essential car details.");
    }

    // Base upload paths
    $uploadBase = realpath(__DIR__ . '/uploads/') . DIRECTORY_SEPARATOR;
    error_log("Upload base: $uploadBase");

    $carFolder = $refNo . '_' . $make . '_' . $model;
    $uploadDirFull = $uploadBase . $carFolder . DIRECTORY_SEPARATOR;

    if (!file_exists($uploadDirFull)) {
        if (!mkdir($uploadDirFull, 0755, true)) {
            throw new Exception("Failed to create directory: " . $uploadDirFull);
        }
        error_log("Created folder: $uploadDirFull");
    }

    // Helper to safely extract POST values (treat empty strings as NULL)
    $getPostValue = fn($key, $default = null) =>
        array_key_exists($key, $_POST) && $_POST[$key] !== ''
            ? $_POST[$key]
            : $default;

    // Process images: new + retained
    $existingImages = json_decode(stripslashes($_POST['existing_images'] ?? '[]'), true) ?: [];
    $cleanedExistingImages = array_filter(array_map(function ($path) {
        $clean = str_replace('\\', '/', trim($path));
        if (strpos($clean, 'uploads/') === 0) {
            return $clean;
        }
        return 'uploads/' . ltrim($clean, '/');
    }, $existingImages));

    // Process new uploads
    $newImagePaths = [];
    if (!empty($_FILES['new_images']['tmp_name'])) {
        foreach ($_FILES['new_images']['tmp_name'] as $index => $tmpName) {
            if (empty($tmpName)) continue;

            $fileName = $_FILES['new_images']['name'][$index];
            $fileError = $_FILES['new_images']['error'][$index];
            if ($fileError !== UPLOAD_ERR_OK) continue;

            $fileExt = pathinfo($fileName, PATHINFO_EXTENSION);
            $uniqueName = uniqid('', true) . '.' . $fileExt;
            $targetPath = $uploadDirFull . $uniqueName;
            $relativePath = 'uploads/' . $carFolder . '/' . $uniqueName;

            if (move_uploaded_file($tmpName, $targetPath)) {
                $newImagePaths[] = $relativePath;
                error_log("Uploaded: $relativePath");
            }
        }
    }

    // Final images for DB
    $allImagesForDb = array_merge($cleanedExistingImages, $newImagePaths);

    // ❗ Delete removed images
    $removedImages = json_decode(stripslashes($_POST['removed_images'] ?? '[]'), true) ?: [];
    foreach ($removedImages as $imagePath) {
        $cleanPath = str_replace('\\', '/', trim($imagePath, '/'));
        if (strpos($cleanPath, 'uploads/') !== 0) {
            $cleanPath = 'uploads/' . $cleanPath;
        }

        $fullPath = $uploadBase . str_replace('uploads/', '', $cleanPath);

        if (file_exists($fullPath)) {
            if (unlink($fullPath)) {
                error_log("✅ Deleted image: $fullPath");
            } else {
                error_log("❌ Failed to delete image: $fullPath");
            }
        } else {
            error_log("⚠️ Image not found for deletion: $fullPath");
        }
    }

    // Update the database
    $sql = "UPDATE cars_inventory SET 
        ref_no = ?, make = ?, model = ?, year = ?, invoice_date = ?, price = ?, currency = ?, color = ?, mileage = ?, 
        transmission = ?, fuel = ?, status = ?, user_name = ?, 
        phone = ?, company = ?, address = ?, image_urls = ?, 
        size = ?, category = ?, dimension = ?, m3 = ?, engine_capacity = ?, 
        chassis_no = ?, door = ?, seat = ?, ship_name = ?, departure_port = ?, 
        arrival_port = ?, freight = ?, discount = ?, booking_ref = ?, final_value = ?
        WHERE id = ?";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Failed to prepare SQL statement: " . $conn->error);
    }

    $imageUrlsJson = json_encode($allImagesForDb);

    $params = [
        $_POST['ref_no'] ?? '',
        $_POST['make'] ?? '',
        $_POST['model'] ?? '',
        $getPostValue('year'),
        $getPostValue('invoice_date'),
        $getPostValue('price'),
        $getPostValue('currency'),
        $getPostValue('color'),
        $getPostValue('mileage'),
        $getPostValue('transmission'),
        $getPostValue('fuel'),
        $getPostValue('status'),
        $getPostValue('user_name'),
        $getPostValue('phone'),
        $getPostValue('company'),
        $getPostValue('address'),
        $imageUrlsJson,
        $getPostValue('size'),
        $getPostValue('category'),
        $getPostValue('dimension'),
        $getPostValue('m3'),
        $getPostValue('engine_capacity'),
        $getPostValue('chassis_no'),
        $getPostValue('door'),
        $getPostValue('seat'),
        $getPostValue('ship_name'),
        $getPostValue('departure_port'),
        $getPostValue('arrival_port'),
        $getPostValue('freight'),
        $getPostValue('discount'),
        $getPostValue('booking_ref'),
        $getPostValue('final_value'),
        $_POST['id'] ?? null
    ];

    $types = str_repeat('s', count($params) - 1) . 'i';
    $stmt->bind_param($types, ...$params);
    if (!$stmt->execute()) throw new Exception("Database update failed.");

    // Return new image list with slashes
    $responseImages = array_map(fn($img) => '/' . ltrim($img, '/'), $allImagesForDb);

    ob_end_clean();
    echo json_encode([
        "success" => true,
        "message" => "Car updated successfully.",
        "image_urls" => $responseImages
    ]);
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
    error_log("❌ Exception: " . $e->getMessage());
} finally {
    if (isset($stmt) && $stmt instanceof mysqli_stmt) {
        $stmt->close();
    }
    if (isset($conn)) $conn->close();
}
?>
