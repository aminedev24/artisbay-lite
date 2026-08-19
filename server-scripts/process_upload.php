<?php
/**
 * Artisbay Lite Inc. — Partner stock importer
 *
 * Fetches pre-processed vehicle data from partner makes JSON files,
 * filters to a curated premium/luxury selection, then fetches the FULL
 * individual record for each eligible vehicle (full photo gallery,
 * chassis number, model code, equipment list) and upserts into the
 * cars_stock MySQL table.
 *
 * Confirmed live 2026-07-15: the slim per-make JSON files only carry a
 * single photo and no chassis/model_code/equipment at all (by design —
 * they're a lightweight browsing-list format). The full record lives at
 * a separate per-vehicle endpoint on the partner's own search API. This
 * importer now fetches that too, in concurrent batches (curl_multi) so
 * a full run doesn't take hours of fully-sequential requests, with a
 * short pause between batches to stay polite to the partner's server.
 * If a full-record fetch fails for a given vehicle, it falls back to
 * the old slim single-photo behavior rather than dropping the vehicle.
 *
 * Imported rows are tagged company='ichinomiya_import' so they can be
 * cleanly replaced each run without touching manually added cars.
 *
 * Deploy location : /home2/yqjezvte/process_upload.php  (OUTSIDE web root)
 * cPanel cron     : 0 4 * * * php /home2/yqjezvte/process_upload.php >> /home2/yqjezvte/process_upload.log 2>&1
 */

// ============================================================
// Configuration
// ============================================================
$IMPORT_TAG    = 'ichinomiya_import';
$PARTNER_BASE  = 'https://www.ichinomiya-motors.com/makes';
$SEARCH_API    = 'https://www.ichinomiya-motors.com/api/search.php';
$FETCH_CONCURRENCY = 15; // simultaneous full-record requests per batch

// Artisbay Lite margin added on top of the partner's price_usd (which already
// includes their own dealer markup). Applied once here at import time so
// it's baked into cars_stock.price — fetchStock.php and the frontend just
// display whatever is stored, with no further markup.
$MARKUP_RATE = 1.03;

// Shared secret so Ichinomiya's .htaccess can recognize this importer and
// exempt it from the referer-only JSON access rule. Must match the value
// configured in Ichinomiya's public_html/.htaccess (X-Partner-Key check).
// Set in the cPanel cron job environment — never hardcoded here.
$PARTNER_KEY = getenv('ICHINOMIYA_PARTNER_KEY') ?: '';

// Static cookie the partner site's bot-check challenge hands out on first
// contact ("humans_21909=1"); sending it up front lets automated requests
// pass the same check a browser would satisfy by executing its JS reload.
$HUMAN_CHECK_COOKIE = 'humans_21909=1';

// Makes to fetch → their JSON filename on partner server
$MAKE_FILES = [
    'VOLKSWAGEN'    => 'VOLKSWAGEN',
    'MERCEDES BENZ' => 'MERCEDES_BENZ',
    'BMW'           => 'BMW',
    'ALPINE'        => 'ALPINE',
    'AUDI'          => 'AUDI',
    'PORSCHE'       => 'PORSCHE',
    'FERRARI'       => 'FERRARI',
    'LAMBORGHINI'   => 'LAMBORGHINI',
    'LEXUS'         => 'LEXUS',
    'TOYOTA'        => 'TOYOTA',
    'ROLLS-ROYCE'   => 'ROLLS-ROYCE',
    'MASERATI'      => 'MASERATI',
    'LAND ROVER'    => 'LAND_ROVER',
];

// DB credentials — set these in the cPanel cron environment
$DB_HOST = getenv('DB_HOST') ?: 'localhost';
$DB_NAME = getenv('DB_NAME') ?: 'artisbay';
$DB_USER = getenv('DB_USER') ?: '';
$DB_PASS = getenv('DB_PASS') ?: '';

// ============================================================
// Vehicle eligibility filter — curated premium/luxury selection
// ============================================================
function is_allowed_vehicle(string $make, string $model, int $year, string $grade = ''): bool {
    $m = strtoupper(trim($make));
    $d = strtoupper(trim($model));
    $g = strtoupper(trim($grade));
    $currentYear = (int)date('Y');

    // Guardrail: partner feed occasionally emits future model years.
    // Keep only current/past stock years.
    if ($year <= 0 || $year > $currentYear) return false;

    // Volkswagen: Golf or Polo, 2014+; Tiguan, 2018+
    if ($m === 'VOLKSWAGEN') {
        if ($year >= 2014 && (strpos($d, 'GOLF') !== false || strpos($d, 'POLO') !== false)) return true;
        if ($year >= 2018 && strpos($d, 'TIGUAN') !== false) return true;
    }

    // Mercedes Benz: any AMG or Maybach (any year);
    // GLE/GLS/GLC/C-Class/E-Class/S-Class 2015+
    if ($m === 'MERCEDES BENZ' || $m === 'MERCEDES-BENZ') {
        if (strpos($d, 'AMG') !== false)     return true;
        if (strpos($d, 'MAYBACH') !== false) return true;
        if ($year >= 2015) {
            if (strpos($d, 'GLE') !== false) return true;
            if (strpos($d, 'GLS') !== false) return true;
            if (strpos($d, 'GLC') !== false) return true;
            if (strpos($d, 'C-CLASS') !== false || strpos($d, 'C CLASS') !== false ||
                preg_match('/^C[\s\-]?\d/', $d)) return true;
            if (strpos($d, 'E-CLASS') !== false || strpos($d, 'E CLASS') !== false ||
                preg_match('/^E[\s\-]?\d/', $d)) return true;
            if (preg_match('/\bS[\s\-]?CLASS\b/', $d) ||
                preg_match('/^S[\s\-]?\d/', $d)) return true;
        }
    }

    // BMW: M2–M8, M Coupe (any year); X5/X6/X8 2015+; XM 2015+;
    // M Sport trim 2015+ (trim usually lives in the grade field, not model)
    if ($m === 'BMW') {
        if (preg_match('/\bM[2-8]\b/', $d))               return true;
        if (strpos($d, 'M COUPE') !== false)               return true;
        if ($year >= 2015 && preg_match('/\bX[568]\b/', $d)) return true;
        if ($year >= 2015 && (
            preg_match('/\bXM\b/', $d) || preg_match('/\bX\d*M\b/', $d)
        )) return true;
        if ($year >= 2015 && (
            strpos($d, 'M SPORT') !== false || strpos($g, 'M SPORT') !== false ||
            strpos($d, 'M-SPORT') !== false || strpos($g, 'M-SPORT') !== false
        )) return true;
    }

    // Alpine: all
    if ($m === 'ALPINE') return true;

    // Audi: Q3, Q4, Q5, 2015+
    if ($m === 'AUDI' && $year >= 2015) {
        if (preg_match('/\bQ[345]\b/', $d)) return true;
    }

    // Porsche, Ferrari, Lamborghini: all
    if ($m === 'PORSCHE' || $m === 'FERRARI' || $m === 'LAMBORGHINI') return true;

    // Lexus: 2020+
    if ($m === 'LEXUS' && $year >= 2020) return true;

    // Toyota: Land Cruiser 2018+; Hilux 2015+
    if ($m === 'TOYOTA' && $year >= 2018 && strpos($d, 'LAND CRUISER') !== false) return true;
    if ($m === 'TOYOTA' && $year >= 2015 && strpos($d, 'HILUX') !== false) return true;

    // Rolls-Royce: 2015+
    if (($m === 'ROLLS-ROYCE' || $m === 'ROLLS ROYCE') && $year >= 2015) return true;

    // Maserati: 2015+
    if ($m === 'MASERATI' && $year >= 2015) return true;

    // Land Rover: Range Rover 2018+
    if ($m === 'LAND ROVER' && $year >= 2018 && strpos($d, 'RANGE ROVER') !== false) return true;

    return false;
}

// ============================================================
// HTTP helpers (cURL)
// ============================================================
function fetch_json(string $url, string $partnerKey): ?array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_USERAGENT      => 'Artisbay Lite-Importer/1.0',
        CURLOPT_HTTPHEADER     => ["X-Partner-Key: $partnerKey"],
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch); // @deprecated in PHP 8.4 but harmless
    if ($code !== 200 || !$body) return null;
    return json_decode($body, true) ?: null;
}

// Fetch the full individual record for each ref, in concurrent batches.
// Returns [ref => full_record_array] for whichever refs succeeded — a
// missing entry means the caller should fall back to the slim data.
function fetch_full_records(array $refs, string $searchApi, int $concurrency, string $partnerKey, string $humanCheckCookie): array {
    $results = [];
    $chunks = array_chunk(array_values(array_unique(array_filter($refs))), max(1, $concurrency));
    $total = count($chunks);
    foreach ($chunks as $i => $chunk) {
        $mh = curl_multi_init();
        $handles = [];
        foreach ($chunk as $ref) {
            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL            => $searchApi . '?ref=' . urlencode($ref),
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 15,
                CURLOPT_USERAGENT      => 'Artisbay Lite-Importer/1.0',
                CURLOPT_HTTPHEADER     => ["X-Partner-Key: $partnerKey"],
                CURLOPT_COOKIE         => $humanCheckCookie,
            ]);
            curl_multi_add_handle($mh, $ch);
            $handles[$ref] = $ch;
        }

        $running = null;
        do {
            $status = curl_multi_exec($mh, $running);
            if ($running > 0) curl_multi_select($mh, 1.0);
        } while ($running > 0 && $status === CURLM_OK);

        foreach ($handles as $ref => $ch) {
            $body = curl_multi_getcontent($ch);
            $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            if ($code === 200 && $body) {
                $data = json_decode($body, true);
                if (is_array($data) && empty($data['error'])) {
                    $results[$ref] = $data;
                }
            }
            curl_multi_remove_handle($mh, $ch);
            curl_close($ch);
        }
        curl_multi_close($mh);

        echo "[INFO] Full-record batch " . ($i + 1) . "/$total done (" . count($results) . " total so far)\n";
        usleep(150000); // 150ms pause between batches — polite pacing, not a fixed per-request delay
    }
    return $results;
}

// ============================================================
// Fetch and filter vehicles from partner makes JSON files
// ============================================================
$allVehicles = [];
foreach ($MAKE_FILES as $makeName => $filename) {
    $url  = "$PARTNER_BASE/$filename.json";
    $data = fetch_json($url, $PARTNER_KEY);
    if (!$data || empty($data['vehicles'])) {
        echo "[WARN] No data from $url\n";
        continue;
    }
    $count = 0;
    foreach ($data['vehicles'] as $car) {
        $year = (int)($car['year'] ?? 0);
        if (is_allowed_vehicle((string)($car['make'] ?? ''), (string)($car['model'] ?? ''), $year, (string)($car['grade'] ?? ''))) {
            $allVehicles[] = $car;
            $count++;
        }
    }
    echo "[INFO] $makeName — {$data['total']} total, $count matched filter\n";
}
echo "[INFO] Total matched: " . count($allVehicles) . "\n";

// ============================================================
// Fetch full per-vehicle records (photos, chassis, model code, options)
// ============================================================
$refsToFetch = array_map(fn($c) => (string)($c['ref'] ?? ''), $allVehicles);
echo "[INFO] Fetching full vehicle records for " . count(array_filter($refsToFetch)) . " eligible vehicles...\n";
$fullRecords = fetch_full_records($refsToFetch, $SEARCH_API, $FETCH_CONCURRENCY, $PARTNER_KEY, $HUMAN_CHECK_COOKIE);
echo "[INFO] Got full records for " . count($fullRecords) . " of " . count(array_filter($refsToFetch)) . " vehicles"
    . " (" . (count($refsToFetch) - count($fullRecords)) . " will fall back to slim single-photo data)\n";

mysqli_report(MYSQLI_REPORT_OFF);
$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
if ($conn->connect_error) {
    die("[ERROR] " . date('c') . " — DB connect failed: " . $conn->connect_error . "\n");
}
$conn->set_charset('utf8mb4');

// ============================================================
// Ensure cars_stock table exists (safe on first run)
// ============================================================
$conn->query("
    CREATE TABLE IF NOT EXISTS `cars_stock` (
      `id` int NOT NULL AUTO_INCREMENT,
      `ref_no` varchar(50) DEFAULT NULL,
      `make` varchar(50) DEFAULT NULL,
      `model` varchar(50) DEFAULT NULL,
      `price` varchar(50) DEFAULT NULL,
      `category` varchar(50) DEFAULT NULL,
      `color` varchar(50) DEFAULT NULL,
      `year` varchar(10) DEFAULT NULL,
      `engine_capacity` varchar(50) DEFAULT NULL,
      `mileage` varchar(50) DEFAULT NULL,
      `chassis_no` varchar(50) DEFAULT NULL,
      `fuel` varchar(20) DEFAULT NULL,
      `door` varchar(5) DEFAULT NULL,
      `seat` varchar(5) DEFAULT NULL,
      `transmission` varchar(50) DEFAULT NULL,
      `drive` varchar(50) DEFAULT NULL,
      `currency` varchar(55) DEFAULT NULL,
      `buying_price` double DEFAULT '0',
      `image_urls` text,
      `company` varchar(100) DEFAULT NULL,
      `model_code` varchar(50) DEFAULT NULL,
      `options` text,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
");
if ($conn->error) die("[ERROR] Create table failed: " . $conn->error . "\n");

// ============================================================
// Schema migration — add columns if this table predates them.
// Safe to run every time: no-ops once the column already exists.
// ============================================================
function ensure_column(mysqli $conn, string $table, string $column, string $definition): void {
    $safeTable = preg_replace('/[^A-Za-z0-9_]/', '', $table);
    $res = $conn->query("SHOW COLUMNS FROM `$safeTable` LIKE '$column'");
    if ($res && $res->num_rows === 0) {
        $conn->query("ALTER TABLE `$safeTable` ADD COLUMN `$column` $definition");
        echo $conn->error
            ? "[WARN] Could not add column $column: {$conn->error}\n"
            : "[INFO] Added missing column: $column\n";
    }
}
ensure_column($conn, 'cars_stock', 'model_code', 'varchar(50) DEFAULT NULL');
ensure_column($conn, 'cars_stock', 'options', 'text');

// ============================================================
// Safety guard — never wipe the existing import on a failed fetch.
// If every make request failed (partner site unreachable/blocked), abort
// before touching the table rather than deleting rows with nothing to
// replace them.
// ============================================================
if (count($allVehicles) === 0) {
    $conn->close();
    die("[ERROR] " . date('c') . " — 0 vehicles fetched from partner source; aborting without touching cars_stock.\n");
}

// ============================================================
// Clear previous import (preserves manually added cars)
// ============================================================
$conn->query("DELETE FROM cars_stock WHERE company = '$IMPORT_TAG'");
$deleted = $conn->affected_rows;
echo "[INFO] Removed $deleted previously imported rows\n";

// ============================================================
// Prepare INSERT statement
// ============================================================
$stmt = $conn->prepare("
    INSERT INTO cars_stock
        (ref_no, make, model, year, engine_capacity, mileage, transmission,
         fuel, color, drive, door, seat, chassis_no, category,
         price, currency, buying_price, image_urls, company, model_code, options)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'USD', ?, ?, ?, ?, ?)
");

if (!$stmt) {
    die("[ERROR] " . date('c') . " — Prepare failed: " . $conn->error . "\n");
}

// ============================================================
// Insert filtered vehicles
// ============================================================
$inserted    = 0;
$skipped     = 0;
$refCounter  = 1;
$fullUsed    = 0;

foreach ($allVehicles as $car) {
    $make  = trim((string)($car['make']  ?? ''));
    $model = trim((string)($car['model'] ?? ''));
    if (!$make || !$model) { $skipped++; continue; }

    $yearInt = (int)($car['year'] ?? 0);
    $currentYear = (int)date('Y');
    if ($yearInt <= 0 || $yearInt > $currentYear) { $skipped++; continue; }

    $ref    = str_pad($refCounter, 4, '0', STR_PAD_LEFT);
    $year   = (string)$yearInt;
    $cc     = (string)($car['cc']           ?? '');
    $miles  = (int)($car['mileage']         ?? 0);
    $trans  = (string)($car['trans']        ?? '');
    $fuel   = (string)($car['fuel']         ?? '');
    $color  = (string)($car['color']        ?? '');
    $drive  = (string)($car['drive']        ?? '');
    $body   = (string)($car['body']         ?? '');
    $priceUsd = (float)($car['price_usd'] ?? 0);
    $price    = (string)(int) round($priceUsd * $MARKUP_RATE);
    $buying = 0.0;

    $sourceRef = (string)($car['ref'] ?? '');
    $full = $fullRecords[$sourceRef] ?? null;
    if ($full) $fullUsed++;

    // Images — prefer the full record's complete gallery; fall back to the
    // slim record's single img URL if the full fetch failed for this car.
    if ($full && !empty($full['images']) && is_array($full['images'])) {
        $imageJson = json_encode(array_values(array_filter(array_map('strval', $full['images']))), JSON_UNESCAPED_UNICODE);
    } else {
        $imgUrl    = trim((string)($car['img'] ?? ''));
        $imageJson = $imgUrl ? json_encode([$imgUrl], JSON_UNESCAPED_UNICODE) : '[]';
    }

    $chassis    = $full ? trim((string)($full['chassis'] ?? '')) : '';
    $modelCode  = $full ? trim((string)($full['model_code'] ?? '')) : '';
    $optionsArr = ($full && is_array($full['options'] ?? null)) ? array_values(array_filter(array_map('strval', $full['options']))) : [];
    $optionsJson = json_encode($optionsArr, JSON_UNESCAPED_UNICODE);

    $door = '';
    $seat = '';

    $stmt->bind_param(
        'sssssssssssssssdssss',
        $ref, $make, $model, $year, $cc, $miles, $trans,
        $fuel, $color, $drive, $door, $seat, $chassis, $body,
        $price, $buying, $imageJson, $IMPORT_TAG, $modelCode, $optionsJson
    );

    if ($stmt->execute()) {
        $inserted++;
        $refCounter++;
    } else {
        echo "[WARN] Row skipped ({$make} {$model}): " . $stmt->error . "\n";
        $skipped++;
    }
}

$stmt->close();
$conn->close();

echo "[OK] " . date('c') . " — Inserted: $inserted | Skipped: $skipped | Full records used: $fullUsed\n";
