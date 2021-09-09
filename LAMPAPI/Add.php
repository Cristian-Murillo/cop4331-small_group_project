<?php
	ini_set('display_errors', 'On');
	ini_set("error_log", "/tmp/php.log");
	error_reporting(E_ALL);

	$inData = getRequestInfo();

	$userId = $inData["UserId"];
	$firstName = $inData["ContactFirstName"];
	$lastName = $inData["ContactLastName"];
	$email = $inData["Email"];
	$phoneNumber = $inData["Phone"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "ContactManager");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
 	{
		if (checkIfContactExists($conn, $inData["UserID"], $inData["ContactFirstName"],
			$inData["ContactLastName"], $inData["Email"], $inData["Phone"]));
			returnWithError("Contact exists");
		$stmt = $conn->prepare("INSERT into contacts (userID,firstName,lastName,email,phoneNumber) VALUES(?,?,?,?,?)");
		$stmt->bind_param("sssss", $userId, $firstName, $lastName, $email, $phoneNumber);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function checkIfContactExists($conn, $userID, $firstName, $lastName, $email, $phoneNumber)
	{
		$result = $conn->query("SELECT * FROM contacts WHERE userID = $userID
			 AND firstName = $firstName AND lastName = $lastName AND email = $email
			 AND phoneNumber = $phoneNumber");
		return $result->num_rows == 0;
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>
