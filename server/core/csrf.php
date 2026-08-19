<?php
/**
 * CSRF token utilities — Synchronizer Token Pattern.
 *
 * Usage:
 *   - On any GET endpoint: call csrf_set_token() to issue/refresh the token.
 *   - On every state-changing endpoint (POST/PUT/DELETE): call csrf_validate() before processing.
 *
 * The token is stored in the PHP session and returned to the frontend in JSON
 * responses from check_session.php so the SPA can embed it in subsequent POST headers.
 */

function csrf_set_token(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrf_validate(): void {
    $header = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $stored = $_SESSION['csrf_token'] ?? '';

    if (!$header || !$stored || !hash_equals($stored, $header)) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Invalid or missing CSRF token.']);
        exit;
    }
}
?>
