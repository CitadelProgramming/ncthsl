<?php
// Database connection
$servername = "localhost";
$username = "root";  // change this if your server uses another username
$password = "";      // add password if required
$dbname = "aviation_db"; // change this to your database name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check for POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Invalid email format.";
        exit;
    }

    // Prepare statement to avoid duplicates
    $stmt = $conn->prepare("INSERT INTO newsletter_subscribers (email) VALUES (?)");
    $stmt->bind_param("s", $email);

    if ($stmt->execute()) {
        echo "Thank you for subscribing!";
    } else {
        if ($conn->errno == 1062) {
            echo "This email is already subscribed.";
        } else {
            echo "Error: " . $conn->error;
        }
    }

    $stmt->close();
}
$conn->close();
?>
