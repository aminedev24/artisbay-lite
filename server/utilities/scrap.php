<?php
// Use cURL to fetch the page
$url = 'https://www.sbishinseibank.co.jp/english/gaika/exchange_rate_fx.html';
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$html = curl_exec($ch);

// Check for cURL errors
if (curl_errno($ch)) {
    error_log('cURL error: ' . curl_error($ch));
} elseif ($html === false) {
    error_log('Failed to fetch the URL: ' . $url);
}

curl_close($ch);

// Load the HTML into DOMDocument
$doc = new DOMDocument();
@$doc->loadHTML($html); // Suppress warnings for malformed HTML

// Check if HTML was loaded successfully
if (empty($html) || !$doc->documentElement) {
    error_log('Failed to load HTML from the URL.');
    echo "Failed to load the page content.";
    exit;
}

// Create an XPath object
$xpath = new DOMXPath($doc);

// Query the element by its attribute
$rateElement = $xpath->query('//span[@data-interestrate_sre="Fxrate_N_USD_sellrate"]');

if ($rateElement->length > 0) {
    echo $rateElement->item(0)->nodeValue;
} else {
    error_log('Element not found with the specified XPath query.');
    echo "Element not found.";
}
?>
