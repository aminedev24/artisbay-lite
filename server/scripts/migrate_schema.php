<?php
// One-time / repeatable schema migration: brings live tables up to date with
// the columns the code expects (created_by, created_at, model_code, etc.).
// Safe to re-run — only missing columns are added.

require_once __DIR__ . '/../core/db_connection.php';
require_once __DIR__ . '/../core/db_migrations.php';

ensure_columns($conn, 'cars_stock', [
    'model_code' => 'varchar(50) DEFAULT NULL',
    'created_by' => 'int(11) DEFAULT NULL',
    'steering'   => 'varchar(50) DEFAULT NULL',
    'options'    => 'text DEFAULT NULL',
    'popularity' => 'int(11) DEFAULT 0',
    'created_at' => 'datetime DEFAULT CURRENT_TIMESTAMP',
]);

ensure_columns($conn, 'cars_inventory', [
    'created_by' => 'int(11) DEFAULT NULL',
    'created_at' => 'datetime DEFAULT CURRENT_TIMESTAMP',
    'steering'   => 'varchar(50) DEFAULT NULL',
    'model_code' => 'varchar(50) DEFAULT NULL',
    'options'    => 'text DEFAULT NULL',
]);

ensure_columns($conn, 'invoices', [
    'vehicle_ref' => 'varchar(255) DEFAULT NULL',
]);

echo "Schema migration complete.\n";
