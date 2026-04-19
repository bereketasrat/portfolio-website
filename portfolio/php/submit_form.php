<?php
/**
 * submit_form.php — Contact form handler
 */

// Always respond with JSON
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ---- Autoloader & DB ----
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// ---- Sanitize inputs ----
$name    = trim(strip_tags($_POST['name']    ?? ''));
$email   = trim(strip_tags($_POST['email']   ?? ''));
$subject = trim(strip_tags($_POST['subject'] ?? ''));
$message = trim(strip_tags($_POST['message'] ?? ''));

// ---- Validate ----
$errors = [];
if (strlen($name) < 2)                          $errors[] = 'Name must be at least 2 characters.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Please provide a valid email address.';
if (strlen($message) < 10)                      $errors[] = 'Message must be at least 10 characters.';

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

// ---- Save to database ----
try {
    $pdo  = getDB();
    $stmt = $pdo->prepare(
        'INSERT INTO messages (name, email, subject, message) VALUES (:name, :email, :subject, :message)'
    );
    $stmt->execute([':name' => $name, ':email' => $email, ':subject' => $subject, ':message' => $message]);
} catch (PDOException $e) {
    error_log('DB Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'A server error occurred. Please try again later.']);
    exit;
}

// ---- Send email ----
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = SMTP_PORT;

    $mail->setFrom(SMTP_USER, NOTIFY_NAME);
    $mail->addAddress(NOTIFY_TO);
    $mail->addReplyTo($email, $name);

    $mail->isHTML(true);
    $mail->Subject = $subject ? "Portfolio Contact: $subject" : "New message from $name";
    $mail->Body    = "
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> "    . htmlspecialchars($name)              . "</p>
        <p><strong>Email:</strong> "   . htmlspecialchars($email)             . "</p>
        <p><strong>Subject:</strong> " . htmlspecialchars($subject ?: 'N/A')  . "</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>" . nl2br(htmlspecialchars($message)) . "</p>
    ";
    $mail->AltBody = "Name: $name\nEmail: $email\nSubject: $subject\n\nMessage:\n$message";

    $mail->send();

} catch (Exception $e) {
    error_log('Mailer Error: ' . $mail->ErrorInfo);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Message saved but email failed to send. Error: ' . $mail->ErrorInfo]);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Thanks for reaching out, ' . htmlspecialchars($name) . '! I\'ll get back to you within 24 hours.'
]);
