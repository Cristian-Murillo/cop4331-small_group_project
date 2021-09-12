<?php
	ini_set('display_errors', 'On');
	ini_set("error_log", "/tmp/php.log");
	error_reporting(E_ALL);

	$inData = getRequestInfo();

	$UserId = $inData["id"];
	$ContactFirstName = $inData["FirstName"];
	$ContactLastName = $inData["LastName"];
	$Email = $inData["Email"];
	$Phone = $inData["PhoneNumber"];

  $uFirstName = $inData["uFirstName"];
  $uLastName = $inData["uLastName"];
  $uEmail = $inData["uEmail"];
  $uPhoneNumber = $inData["uPhoneNumber"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "ContactManager");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
 	{
		if (empty($ContactFirstName) || empty($ContactLastName) || empty($Email) || empty($Phone) || empty($uFirstName) || empty($uLastName) || empty($uEmail) || empty($uPhoneNumber))
		{
			returnWithError("Fill in all required fields");
			exit();
		}

		if (!checkIfContactExists($conn, $UserId, $ContactFirstName, $ContactLastName, $Email, $Phone)) {
			returnWithError("Contact does not exist");
			exit();
		}

		if (updateContact($conn, $inData["id"], $inData["FirstName"], $inData["LastName"], $inData["Email"], $inData["PhoneNumber"], $inData["uFirstName"], $inData["uLastName"], $inData["uEmail"], $inData["uPhoneNumber"]))
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


	function checkIfContactExists($conn, $userID, $firstName, $lastName, $email, $phoneNumber)
	{
		$result = $conn->query("SELECT * FROM contacts WHERE UserID = '$userID'
			 AND ContactFirstName = '$firstName' AND ContactLastName = '$lastName' AND Email = '$email'
			 AND Phone = '$phoneNumber'");
		return $result->num_rows > 0;
	}

	function getContactInfo($conn, $ContactFirstName, $ContactLastName)
	{
		$result = $conn->query("SELECT ID, ContactFirstName, ContactLastName, Email, Phone FROM contacts WHERE ContactFirstName = '$ContactFirstName' AND ContactLastName = '$ContactLastName'") or die($conn->error);
		return $result->fetch_assoc();
	}

	function updateContact($conn, $id, $FirstName, $LastName, $Email, $PhoneNumber, $uFirstName, $uLastName, $uEmail, $uPhoneNumber)
	{
		$result = $conn->query("UPDATE contacts SET ContactFirstName = '$uFirstName',
       ContactLastName = '$uLastName', Email = '$uEmail', Phone = '$uPhoneNumber'
       WHERE UserID = '$id' AND ContactFirstName = '$FirstName' AND
       ContactLastName = '$LastName' AND Email = '$Email' AND Phone = '$PhoneNumber'");
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
