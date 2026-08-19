<?php
/**
 * Artisbay Lite Chatbot Proxy
 * Securely forwards API requests without exposing the API Key.
 */

// --- 1. CONFIGURATION ---
// Your Aurora API key
$auroraKey = "ak_artisbay_726429d7a014cf86117a07aad714f3da";
// Allowed origins for CORS (Security)
$allowedOrigins = [
    "https://artisbay.com",       // Your live site
    "http://localhost:3000",      // React default local port
    "http://localhost:5173",      // Vite default local port
    "http://127.0.0.1:5500"       // VS Code Live Server
];

// --- 2. CORS & SECURITY HEADERS ---
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}

// Handle preflight "OPTIONS" requests from the browser
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// Stream the upstream SSE straight through to the browser.
header("Content-Type: text/event-stream");
header("Cache-Control: no-cache, no-transform");
header("Connection: keep-alive");
header("X-Accel-Buffering: no"); // disable proxy buffering (nginx)

// Kill PHP/Apache output buffering so tokens flush as they arrive.
@ini_set('zlib.output_compression', '0');
@ini_set('output_buffering', '0');
@ini_set('implicit_flush', '1');
while (ob_get_level() > 0) { ob_end_flush(); }
ob_implicit_flush(true);

// --- 3. GET THE INCOMING DATA ---
$jsonInput = file_get_contents('php://input');

if (!$jsonInput) {
    http_response_code(400);
    echo json_encode(["error" => "No input provided"]);
    exit;
}

// --- 4. FORWARD TO AURORA CHAT API ---
// Parse incoming JSON and add the required mode field
$inputData = json_decode($jsonInput, true);
if (!$inputData) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON input"]);
    exit;
}
$inputData['mode'] = 'artisbay_chat';
$payload = json_encode($inputData);

error_log("[AURORA PROXY] Incoming payload keys: " . implode(', ', array_keys($inputData)));
error_log("[AURORA PROXY] Mode set to: " . $inputData['mode']);
error_log("[AURORA PROXY] Sending to: https://api.aurora-lumen.com/api/chat");
error_log("[AURORA PROXY] Auth header: X-API-Key (present: " . (empty($auroraKey) ? 'NO' : 'YES') . ")");

$auroraUrl = "https://api.aurora-lumen.com/api/chat";
$ch = curl_init($auroraUrl);

curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'X-API-Key: ' . $auroraKey,
    'Accept: text/event-stream'
]);

// Stream each chunk straight to the client as it arrives from Aurora.
curl_setopt($ch, CURLOPT_WRITEFUNCTION, function ($curl, $chunk) {
    echo $chunk;
    flush();
    return strlen($chunk);
});

curl_exec($ch);

if (curl_errno($ch)) {
    error_log("[AURORA PROXY] cURL error: " . curl_error($ch));
    // Emit an SSE-framed error so the client surfaces it gracefully.
    echo "data: " . json_encode(["error" => "Proxy Error: " . curl_error($ch)]) . "\n\n";
    echo "data: [DONE]\n\n";
    flush();
}

curl_close($ch);
?>