
<?php
	ini_set('display_errors', 'On');
	ini_set("error_log", "/tmp/php.log")
	error_reporting(E_ALL);
	$inData = getRequestInfo();

	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$login = $inData["login"];
	$password = $inData["password"];

	// Create connection
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "ContactManager");
	// Check connection
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$sql = "INSERT INTO Users (firstName, lastName, Login, Password) VALUES ($inData["firstName"], $inData["lastName"], $inData["login"], $inData["password"])";
		if ( $result -> $conn->query($sql) ) {
			returnWithError("Record recorded sucessfully");
		} else {
			returnWithError("Error creating recor");
		}
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
