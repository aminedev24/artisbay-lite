<?php
// Safe schema migrations for MySQL/MariaDB versions that don't support
// "ALTER TABLE ... ADD COLUMN IF NOT EXISTS". Checks information_schema
// instead so the same script works on every server version.

function ensure_columns(mysqli $conn, string $table, array $columns): void
{
    $existing = [];
    $table = $conn->real_escape_string($table);
    $res = $conn->query(
        "SELECT COLUMN_NAME FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '{$table}'"
    );
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $existing[$row['COLUMN_NAME']] = true;
        }
    }
    foreach ($columns as $name => $definition) {
        if (!isset($existing[$name])) {
            $conn->query("ALTER TABLE `{$table}` ADD COLUMN `{$name}` {$definition}");
        }
    }
}
