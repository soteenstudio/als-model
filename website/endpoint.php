<?php
include('db_connect.php');

// Ambil API key dari header
$headers = apache_request_headers();
$api_key = isset($headers['API-Key']) ? $headers['API-Key'] : null;

// Validasi API key
if ($api_key) {
    $stmt = $conn->prepare("SELECT user_id FROM api_keys WHERE api_key = ? AND status = 'active'");
    $stmt->bind_param("s", $api_key);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($user_id);
        $stmt->fetch();

        // Endpoint logic di sini
        $response = [
            "success" => true,
            "message" => "API Key valid.",
            "data" => [
                "user_id" => $user_id,
                "example" => "Ini adalah data API endpoint."
            ]
        ];
    } else {
        http_response_code(401); // Unauthorized
        $response = [
            "success" => false,
            "message" => "API Key tidak valid atau tidak aktif."
        ];
    }

    $stmt->close();
} else {
    http_response_code(400); // Bad Request
    $response = [
        "success" => false,
        "message" => "API Key tidak ditemukan di header."
    ];
}

$conn->close();

// Kirimkan respons JSON
header('Content-Type: application/json');
echo json_encode($response);

error_reporting(E_ALL);
ini_set('display_errors', 1);
?>