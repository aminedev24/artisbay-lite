<?php
// Get the user's IP address
$userIp = $_SERVER['REMOTE_ADDR'];

// Check if the IP is a local IP (localhost)
if ($userIp === '::1' || $userIp === '127.0.0.1') {
    $region = 'Localhost (Testing)';
} else {
    // Fetch the region from ipinfo.io
    try {
        $ipInfoResponse = file_get_contents("http://ipinfo.io/{$userIp}/json");
        if ($ipInfoResponse) {
            $ipInfo = json_decode($ipInfoResponse, true);
            $region = $ipInfo['region'] ?? 'Unknown region';
        } else {
            $region = 'Unable to retrieve region';
        }
    } catch (Exception $e) {
        $region = 'Unable to retrieve region';
    }
}

// Print the IP and Region to the screen
echo "User IP: $userIp<br>";
echo "Region: $region<br>";
?>
