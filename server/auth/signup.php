<?php
session_start();


require_once __DIR__ . '/../core/db_connection.php';
require_once __DIR__ . '/../core/headers.php';



// Ensure the session contains the user's email and that the email has been verified (from a previous process)
if (!isset($_SESSION['verification_email']) || empty($_SESSION['verification_email'])) {
    echo json_encode(['success' => false, 'error' => 'Email is missing from session.']);
    exit;
}

$email = trim($_SESSION['verification_email']);

// Check if the user already exists in the database
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // The user exists; assume they are verified and prompt to log in
    echo json_encode(['success' => false, 'error' => 'This email is already registered. Please login or use a different email.']);
    $stmt->close();
    exit;
}
$stmt->close();

// Ensure the user has verified their email
if (!isset($_SESSION['is_verified']) || !$_SESSION['is_verified']) {
    echo json_encode(['success' => false, 'error' => 'Email not verified.']);
    exit;
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize and validate inputs
    $fullName = isset($_POST['full-name']) ? trim($_POST['full-name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';
    $country = isset($_POST['country']) ? trim($_POST['country']) : '';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $company = isset($_POST['company']) ? trim($_POST['company']) : '';
    $address = isset($_POST['address']) ? trim($_POST['address']) : '';
    
    // Validate that all fields are filled
    if (empty($fullName) || empty($email) || empty($password) || empty($country) || empty($phone)) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'All fields are required.']);
        exit;
    }

    // Validate the email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'Invalid email format.']);
        exit;
    }

    // Check if the email or phone number already exists
    $userCheckQuery = $conn->prepare("SELECT id FROM users WHERE email = ? OR phone = ?");
    $userCheckQuery->bind_param("ss", $email, $phone);
    $userCheckQuery->execute();
    $userCheckResult = $userCheckQuery->get_result();

    if ($userCheckResult->num_rows > 0) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'Email or phone number already exists. Please try to login.']);
        $userCheckQuery->close();
        exit;
    }

    // Generate a unique ID for the user
    $uid = uniqid('user_', true);
    $_SESSION['uid'] = $uid;
    $is_verified = $_SESSION['is_verified'];

    // Hash the password for security
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Prepare and bind the database statement for inserting the user
    $stmt = $conn->prepare("INSERT INTO users (uid, full_name, email, password, country, phone, company, address,is_verified, joined_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->bind_param("sssssssss", $uid, $fullName, $email, $hashedPassword, $country, $phone, $company, $address, $is_verified);

    if ($stmt->execute()) {
        // Send email notification to admin
        $adminEmail = "contact@artisbay.com"; 
        $subject = "New User Signup Notification";
        $message = "A new user has signed up:\n\n"
                 . "Full Name: $fullName\n"
                 . "Email: $email\n"
                 . "Country: $country\n"
                 . "Phone: $phone\n"
                 . "Company: $company\n"
                 . "Address: $address\n";
        $headers = "From: noreply@artisbay.com";

        mail($adminEmail, $subject, $message, $headers);

        echo json_encode(['success' => true, 'uid' => $uid]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Error: ' . $stmt->error]);
    }

    // Close statement and connection
    $stmt->close();
    $userCheckQuery->close();
}

$conn->close();
?>
