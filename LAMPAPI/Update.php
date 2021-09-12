<?php
	ini_set('display_errors', 'On');
	ini_set("error_log", "/tmp/php.log");
	error_reporting(E_ALL);

	$inData = getRequestInfo();

	$UserID = $inData["UserID"];
  $ID = $inData["ID"];
	$ContactFirstName = $inData["FirstName"];
	$ContactLastName = $inData["LastName"];
	$Email = $inData["Email"];
	$Phone = $inData["PhoneNumber"];

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

		if (!checkIfContactExists($conn, $UserID, $ID)) {
			returnWithError("Contact does not exist");
			exit();
		}

		if (updateContact($conn, $inData["UserID"], $inData["ID"], $inData["FirstName"], $inData["LastName"], $inData["Email"], $inData["PhoneNumber"]))
		{
			$contactInfo = getContactInfo($conn, $ContactFirstName, $ContactLastName);
			returnWithInfo($contactInfo["ID"]);
			exit();
		}
		else
		{
			returnWithError("Error updating contact");
			exit();
		}
	}


	function checkIfContactExists($conn, $UserID, $ID)
	{
		$result = $conn->query("SELECT * FROM contacts WHERE UserID = '$UserID' AND ID = '$ID'");
		return $result->num_rows > 0;
	}

	function getContactInfo($conn, $ContactFirstName, $ContactLastName)
	{
		$result = $conn->query("SELECT ID, ContactFirstName, ContactLastName, Email, Phone FROM contacts WHERE ContactFirstName = '$ContactFirstName' AND ContactLastName = '$ContactLastName'") or die($conn->error);
		return $result->fetch_assoc();
	}

	function updateContact($conn, $UserID, $ID, $FirstName, $LastName, $Email, $PhoneNumber)
	{
		$result = $conn->query("UPDATE contacts SET ContactFirstName = '$FirstName',
       ContactLastName = '$LastName', Email = '$Email', Phone = '$PhoneNumber'
       WHERE UserID = '$UserID' AND ID = '$ID'");
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
