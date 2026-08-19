<?php
session_start();
header("Content-Type: application/json");

require_once __DIR__ . '/../core/db_connection.php';
require_once __DIR__ . '/../core/headers.php';

// Handle TOKEN verification (admin emails - users.verification_token)
if (isset($_GET['token'])) {
    $token = $_GET['token'];
    
    $stmt = $conn->prepare("SELECT id FROM users WHERE verification_token = ? AND is_verified = 0");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $userId = $row['id'];
        
        // Get full user data
        $userStmt = $conn->prepare("
            SELECT id, uid, full_name, email, role 
            FROM users WHERE id = ?
        ");
        $userStmt->bind_param("i", $userId);
        $userStmt->execute();
        $userStmt->bind_result($id, $uid, $fullName, $email, $role);
        $userStmt->fetch();
        $userStmt->close();
        
        // Mark verified & clear token
        $updateStmt = $conn->prepare("UPDATE users SET is_verified = 1, verification_token = NULL, verification_attempts = 0 WHERE id = ?");
        $updateStmt->bind_param("i", $userId);
        $updateStmt->execute();
        $updateStmt->close();
        
        // Start session & set user data (same as login2.php)
        session_regenerate_id(true);
        $_SESSION['user_id'] = $id;
        $_SESSION['full_name'] = $fullName;
        $_SESSION['uid'] = $uid;
        $_SESSION['email'] = $email;
        $_SESSION['role'] = $role;
        $_SESSION['admin_verified'] = true;
        
        // Generate JWT (reuse login2.php logic)
        require_once __DIR__ . '/../core/jwt_functions.php';
        $secretKey = getenv('JWT_SECRET_KEY');
        if (!$secretKey) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Server configuration error.']);
            exit;
        }
        $payload = [
            "uid" => $uid,
            "email" => $email,
            "iat" => time(),
            "exp" => time() + 3600,
            "role" => $role,
        ];
        $header = base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payloadEnc = base64UrlEncode(json_encode($payload));
        $signature = base64UrlEncode(hash_hmac('sha256', "$header.$payloadEnc", $secretKey, true));
        $jwt = "$header.$payloadEnc.$signature";
        
        $stmt->close();
        echo json_encode([
            'success' => true, 
            'message' => 'Email verified and auto-logged in!',
            'token' => $jwt,
            'user' => [
                'id' => $id,
                'uid' => $uid,
                'name' => $fullName,
                'email' => $email,
                'role' => $role
            ],
            'redirect' => '/dashboard'
        ]);
        exit;
    } else {
        $stmt->close();
        echo json_encode(['success' => false, 'message' => 'Invalid or expired token.']);
        exit;
    }
}

// Handle SESSION CODE verification (signup flow)
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['verificationCode'])) {
    echo json_encode(['success' => false, 'error' => 'Email and verification code are required.']);
    exit;
}

$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$codeEntered = trim($data['verificationCode']);

// Check if the session holds a verification code and email
if (isset($_SESSION['verification_code']) && isset($_SESSION['verification_email'])) {
    if ($_SESSION['verification_email'] === $email && $_SESSION['verification_code'] == $codeEntered) {
        // Verification succeeded
        $_SESSION['is_verified'] = true;
        unset($_SESSION['verification_code']);
        echo json_encode(['success' => true, 'message' => 'Email verified successfully!']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid verification code.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'No verification code found. Please request a new one.']);
}
?>

