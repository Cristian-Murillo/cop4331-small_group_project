<?php
ini_set('display_errors', 'On');
ini_set("error_log", "/tmp/php.log");
error_reporting(E_ALL);

$inData = getRequestInfo();

$UserID = $inData["id"];
$ContactFirstName = $inData["deleteFirstName"];
$ContactLastName = $inData["deleteLastName"];
$Email = $inData["deleteEmail"];
$Phone = $inData["deletePhoneNumber"];

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

	if (!checkIfContactExists($conn, $UserID, $ContactFirstName, $ContactLastName, $Email, $Phone)) {
		returnWithError("Contact does not exist");
		exit();
	}

	if (deleteContact($conn, $inData["id"], $inData["deleteFirstName"], $inData["deleteLastName"], $inData["deleteEmail"], $inData["deletePhoneNumber"]))
	{
		returnWithInfo("Contact deleted");
		exit();
	}
	else
	{
		returnWithError("Error deleting contact");
		exit();
	}
}


function checkIfContactExists($conn, $UserID, $firstName, $lastName, $email, $phoneNumber)
{
	$result = $conn->query("SELECT * FROM contacts WHERE UserID = '$UserID'
		 AND ContactFirstName = '$firstName' AND ContactLastName = '$lastName' AND Email = '$email'
		 AND Phone = '$phoneNumber'");
	return $result->num_rows > 0;
}

function deleteContact($conn, $id, $deleteFirstName, $deleteLastName, $deleteEmail, $deletePhoneNumber)
{
	$result = $conn->query("DELETE FROM contacts WHERE UserID = '$id' AND ContactFirstName = '$deleteFirstName' AND ContactLastName = '$deleteLastName' AND Email = '$deleteEmail' AND Phone = '$deletePhoneNumber'");
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
