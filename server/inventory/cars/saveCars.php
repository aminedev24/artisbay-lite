<?php
require_once __DIR__ . '/../../core/headers.php';
session_start();

// Check if user is logged in
if (!isset($_SESSION["user_id"])) {
    error_log("Unauthorized access attempt - user not logged in");
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit;
}

$userId = $_SESSION["user_id"];

// Database Connection
$host = "localhost";
$user = "root"; 
$password = ""; 
$database = "car_inventory"; 

$conn = new mysqli($host, $user, $password, $database);

// Check Connection
if ($conn->connect_error) {
    error_log("Database connection failed: " . $conn->connect_error);
    die(json_encode(["success" => false, "message" => "Database connection failed"]));
}

// Read JSON data
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data["cars"]) || !isset($data["orderId"])) {
    error_log("Invalid JSON data received: " . file_get_contents("php://input"));
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit;
}

$orderId = $data["orderId"];
$cars = $data["cars"];

// Start transaction
$conn->begin_transaction();

try {
    foreach ($cars as $car) {
        $carId = $car["carId"];
        $make = $car["make"];
        $model = $car["model"];
        $buyingPrice = (int) $car["buyingPrice"];
        $transportation = (int) $car["transportation"];
        $units = (int) $car["units"];
        $tax = (int) $car["tax"];

        // Insert car with order ID
        $stmt = $conn->prepare("INSERT INTO saved_cars (id, user_id, make, model, buying_price, transportation, units, tax, order_id) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                                ON DUPLICATE KEY UPDATE 
                                make=VALUES(make), model=VALUES(model), buying_price=VALUES(buying_price), 
                                transportation=VALUES(transportation), units=VALUES(units), tax=VALUES(tax), order_id=VALUES(order_id)");

        if (!$stmt) {
            throw new Exception("Error preparing statement for saved_cars: " . $conn->error);
        }

        $stmt->bind_param("ssssiiiss", $carId, $userId, $make, $model, $buyingPrice, $transportation, $units, $tax, $orderId);
        if (!$stmt->execute()) {
            throw new Exception("Error inserting/updating car ($carId): " . $stmt->error);
        }

        // Insert Included Items
        if (!empty($car["includedItems"])) {
            $stmt = $conn->prepare("INSERT INTO included_items (car_id, item_name, user_id, order_id) VALUES (?, ?, ?, ?)");
            if (!$stmt) {
                throw new Exception("Error preparing statement for included_items: " . $conn->error);
            }

            foreach ($car["includedItems"] as $item) {
                $stmt->bind_param("ssss", $carId, $item, $userId, $orderId);
                if (!$stmt->execute()) {
                    throw new Exception("Error inserting included item ($item) for car ($carId): " . $stmt->error);
                }
            }
        }

        // Insert Optional Items
        if (!empty($car["selectedOptionalItems"])) {
            // Prepare the INSERT statement with additional columns (price and units)
            $stmt = $conn->prepare("INSERT INTO optional_items (car_id, item_name, price, units, user_id, order_id) VALUES (?, ?, ?, ?, ?, ?)");
            if (!$stmt) {
                throw new Exception("Error preparing statement for optional_items: " . $conn->error);
            }
        
            foreach ($car["selectedOptionalItems"] as $item) {
                // Bind parameters
                // "ssdi ss" means: 
                //   s: car_id (string)
                //   s: item_name (string)
                //   d: price (double/decimal)
                //   i: units (integer)
                //   s: user_id (string)
                //   s: order_id (string)
                $stmt->bind_param("ssdiss", $carId, $item["name"], $item["price"], $item["units"], $userId, $orderId);
                
                if (!$stmt->execute()) {
                    throw new Exception("Error inserting optional item (" . $item["name"] . ") for car ($carId): " . $stmt->error);
                }
            }
        }
        
    }

    // Commit transaction
    $conn->commit();
    echo json_encode(["success" => true, "message" => "Cars saved successfully", "orderId" => $orderId]);
} catch (Exception $e) {
    // Rollback on error
    $conn->rollback();
    error_log("Transaction failed: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
} finally {
    $conn->close();
}
?>
