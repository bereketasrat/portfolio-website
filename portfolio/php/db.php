<?php
/**
 * db.php — Database connection
 * Uses PDO for secure, prepared-statement-based queries.
 * Include this file wherever a DB connection is needed.
 */

// ---- Database credentials (update these for your environment) ----
define('DB_HOST', 'sql104.infinityfree.com');
define('DB_NAME', 'if0_41699466_portfolio_db');
define('DB_USER', 'if0_41699466');       // Change to your MySQL username
define('DB_PASS', 'iT4mo7lV32ay0');           // Change to your MySQL password
define('DB_CHARSET', 'utf8mb4');

/**
 * Returns a PDO connection instance.
 * Throws a PDOException on failure (caught in submit_form.php).
 */
function getDB(): PDO {
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        DB_HOST, DB_NAME, DB_CHARSET
    );

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,  // Throw exceptions on error
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,        // Return assoc arrays
        PDO::ATTR_EMULATE_PREPARES   => false,                   // Use real prepared statements
    ];

    return new PDO($dsn, DB_USER, DB_PASS, $options);
}
