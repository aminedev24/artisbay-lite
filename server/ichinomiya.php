<?php
/**
 * Ichinomiya Motors data proxy — served from artisbay.com (gator4421) to bypass
 * mod_security IP blocks on ichinomiya's HostGator server (sh00165).
 * GCP Cloud Run cannot reach sh00165 directly; requests route through here instead.
 *
 * Same query interface as search.php:
 *   ?type=stock        → stock totals
 *   ?ref=XXXXXXXXXX    → single vehicle record
 *   ?q=...&limit=N     → keyword search
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: public, max-age=60');

$target = 'https://www.ichinomiya-motors.com/api/search.php';
$qs = http_build_query($_GET);
$url = $qs ? "$target?$qs" : $target;

$ctx = stream_context_create([
    'http' => [
        'user_agent' => 'Mozilla/5.0 (compatible; ArtisbayProxy/1.0)',
        'timeout'    => 10,
        'header'     => "Accept: application/json, */*\r\n",
    ],
    'ssl' => [
        'verify_peer' => false,
    ],
]);

$data = @file_get_contents($url, false, $ctx);

if ($data === false) {
    http_response_code(502);
    echo json_encode(['error' => 'upstream fetch failed', 'url' => $url]);
} else {
    echo $data;
}
