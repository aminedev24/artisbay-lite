<?php
require_once __DIR__ . '/../../core/db_connection.php';
require_once __DIR__ . '/../../core/headers.php';
$refNo = $_POST['refNo'];
$make = $_POST['make'];
$model = $_POST['model'];
$response = [];
$imageUrls = [];

// Sanitize folder name by including make and model
$folderName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $refNo . '_' . $make . '_' . $model);
$uploadDir = "uploads/$folderName/";

if (!file_exists($uploadDir)) {
  mkdir($uploadDir, 0777, true);
}

foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
  $fileName = basename($_FILES['images']['name'][$key]);
  $targetPath = $uploadDir . time() . "_" . $fileName;

  if (move_uploaded_file($tmp_name, $targetPath)) {
    // Save path and refNo in DB
    $stmt = $conn->prepare("INSERT INTO car_images (ref_no, image_path) VALUES (?, ?)");
    $stmt->bind_param("ss", $refNo, $targetPath);
    $stmt->execute();
    $response[] = "Uploaded: $fileName";
    // Add the public URL for the image
    $imageUrls[] = "/" . $targetPath;
  } else {
    $response[] = "Failed: $fileName";
  }
}

header('Content-Type: application/json');
echo json_encode([
  'messages' => $response,
  'image_urls' => $imageUrls
]);
$conn->close();
