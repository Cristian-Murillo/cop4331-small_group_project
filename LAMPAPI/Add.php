<?php
	ini_set('display_errors', 'On');
	ini_set("error_log", "/tmp/php.log");
	error_reporting(E_ALL);

	$inData = getRequestInfo();

	$UserId = $inData["id"];
	$ContactFirstName = $inData["addFirstName"];
	$ContactLastName = $inData["addLastName"];
	$Email = $inData["addEmail"];
	$Phone = $inData["addPhoneNumber"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "ContactManager");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
 	{
		if (empty($ContactFirstName) || empty($ContactLastName) || empty($Email) || empty($Phone))
		{
			returnWithError("Fill in all required fields");
			exit();
		}
		if (createContact($conn, $inData["id"], $inData["addFirstName"], $inData["addLastName"], $inData["addEmail"], $inData["addPhoneNumber"]))
		{
			$contactInfo = getContactInfo($conn, $ContactFirstName, $ContactLastName);
			returnWithInfo($contactInfo["ID"]);
		}
		else
		{
			returnWithError("Error creating contact");
			exit();
		}
	}

	/*
	function checkIfContactExists($conn, $userID, $firstName, $lastName, $email, $phoneNumber)
	{
		$result = $conn->query("SELECT * FROM contacts WHERE userID = $userID
			 AND firstName = $firstName AND lastName = $lastName AND email = $email
			 AND phoneNumber = $phoneNumber");
		return $result->num_rows == 0;
	}
	*/
	function getContactInfo($conn, $ContactFirstName, $ContactLastName)
	{
		$result = $conn->query("SELECT ID, ContactFirstName, ContactLastName, Email, Phone FROM contacts WHERE ContactFirstName = '$ContactFirstName' AND ContactLastName = '$ContactLastName'") or die($conn->error);
		return $result->fetch_assoc();
	}

	function createContact($conn, $id, $addFirstName, $addLastName, $addEmail, $addPhoneNumber)
	{
		$result = $conn->query("INSERT INTO contacts (UserId, ContactFirstName, ContactLastName, Email, Phone) VALUES ('$id', '$addFirstName','$addLastName','$addEmail','$addPhoneNumber')");
		return $result;
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

	function returnWithInfo($id)
	{
		$retValue = '{"id":' . $id . ',"error":""}';
		sendResultInfoAsJson($retValue);
	}

?>
