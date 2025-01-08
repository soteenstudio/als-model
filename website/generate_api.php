<?php
session_start();

// Cek apakah user sudah login
if (!isset($_SESSION['user_id'])) {
    die("Harap login terlebih dahulu.");
}

include('db_connect.php');

// Generate API Key
function generateApiKey() {
    return bin2hex(random_bytes(32)); // Panjang 64 karakter
}

// Proses pembuatan API Key
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['user_id'];
    $api_key = generateApiKey();

    // Simpan ke database
    $stmt = $conn->prepare("INSERT INTO api_keys (user_id, api_key) VALUES (?, ?)");
    $stmt->bind_param("is", $user_id, $api_key);

    if ($stmt->execute()) {
        echo "API Key berhasil dibuat: " . $api_key;
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}
$conn->close();
?>