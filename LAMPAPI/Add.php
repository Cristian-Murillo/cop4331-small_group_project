<?php
	ini_set('display_errors', 'On');
	ini_set("error_log", "/tmp/php.log");
	error_reporting(E_ALL);

	$inData = getRequestInfo();

	//$UserId = $inData["UserId"];
	$FirstName = $inData["addFirstName"];
	$LastName = $inData["addLastName"];
	$Email = $inData["addEmail"];
	$PhoneNumber = $inData["addPhoneNumber"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "ContactManager");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
 	{
		if (empty($FirstName) || empty($LastName) || empty($Email) || empty($PhoneNumber))
		{
			returnWithError("Fill in all required fields");
			exit();
		}

		$stmt = $conn->prepare("INSERT INTO contacts (FirstName,LastName,Email,PhoneNumber) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $firstName, $lastName, $email, $phoneNumber);
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
