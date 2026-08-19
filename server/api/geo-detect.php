<?php

header('Content-Type: application/json');
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Credentials', 'true');

// Proxy IP-based country lookup to avoid browser-side CORS issues.
// Use cURL when available, fallback to file_get_contents.
function fetch_remote($url) {
  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_TIMEOUT => 5,
      CURLOPT_USERAGENT => 'artisbay-geo-detector',
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $body = curl_exec($ch);
    curl_close($ch);
    return $body;
  }
  $ctx = stream_context_create([
    'http' => [
      'timeout' => 5,
      'header' => "User-Agent: artisbay-geo-detector\r\n"
    ]
  ]);
  return @file_get_contents($url, false, $ctx);
}

$body = fetch_remote('https://ipapi.co/json/');

// If ipapi fails or returns non-JSON, try alternate free service.
if ($body === false || !($data = json_decode($body, true))) {
  $body = fetch_remote('https://ipwho.is/');
  $data = $body ? json_decode($body, true) : null;
}

if (!$data) {
  echo json_encode(['success' => false, 'country' => null, 'message' => 'Invalid response']);
  exit;
}

$country = $data['country_name'] ?? $data['country'] ?? null;
echo json_encode(['success' => true, 'country' => $country]);
?>