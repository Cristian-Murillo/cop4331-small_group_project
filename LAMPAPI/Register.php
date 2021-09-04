
<?php
	ini_set('display_errors', 'On');
	ini_set("error_log", "/tmp/php.log");
	error_reporting(E_ALL);
	$inData = getRequestInfo();

	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$login = $inData["login"];
	$password = $inData["password"];

	// Create connection
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "ContactManager");
	// Check connection
	if($conn->connect_error) {
		returnWithError($conn->connect_error);
	} else {
		if (checkIfUserExists($conn, $inData["login"])) {
			if (createUser($conn, $inData["firstName"], $inData["lastName"], $inData["login"], $inData["password"])) {
				$result = getUserInfoByLogin($conn, $login);
				returnWithInfo($result["firstName"], $result["lastName"], $result["ID"]);
			} else {
				returnWithError("Error creating user");
			}
		} else {
			returnWithError("User exists");
		}
		$conn->close();
	}

	function getUserInfoByLogin($conn, $login)
	{
		// Returns an array of firstName, lastName, and ID from user with Login "$login"
		$result = $conn->query("SELECT firstName, lastName, ID FROM Users WHERE Login = '$login'") or die($conn->error);
		return $result->fetch_assoc();
	}

	function createUser($conn, $firstName, $lastName, $login, $password)
	{
		$result = $conn->query("INSERT INTO Users (firstName, lastName, Login, Password) VALUES ('$firstName', '$lastName', '$login', '$password')");
		return $result;
	}

	function checkIfUserExists($conn, $login)
	{
		$result = $conn->query("SELECT * FROM Users WHERE Login = '$login'");
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
