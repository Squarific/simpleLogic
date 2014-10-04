<?php
	$database_host = "localhost";
	$database_user = "urba_logic";
	$database_pass = "QoqmUR9V";
	$database_name = "urba_logic";	
	$database = new mysqli($database_host, $database_user, $database_pass, $database_name);
	if ($database->connect_errno) {
		echo "Failed to connect to database: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
	}	function jsonError ($error) {		exit('{"error": "' . $error . '"}');	}
?>