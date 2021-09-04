<?php

	ini_set('display_errors', 'On');
	ini_set("error_log", "/tmp/php.log");
	error_reporting(E_ALL);

	$inData = getRequestInfo();

	$userId = $inData["userId"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "ContactManager");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
 	{
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE (userID,firstName,lastName) VALUES(?,?,?)");
		$stmt->bind_param("sss", $userId, $firstName, $lastName);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
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
