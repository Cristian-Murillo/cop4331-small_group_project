
<?php
	$inData = getRequestInfo();

	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$login = $inData["login"];
	$password = $inData["password"];
	$passwordConfirm = $inData["passwordConfirm"];

	// Create connection
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "ContactManager");
	// Check connection
	if($conn->connect_error) {
		returnWithError($conn->connect_error);
	} else {
		if (empty($firstName) || empty($lastName) || empty($login) || empty($password) || empty($passwordConfirm)) { // Check for empty fields
			returnWithError("Fill in all the required fields");
			exit();
		}

		if ($password !== $passwordConfirm) { // Check if passwords match
			returnWithError("Passwords do not match");
			exit();
		}

		if (checkIfUserExists($conn, $inData["login"])) { // Check if user with 'login' already exists
			returnWithError("User already exists");
			exit();
		}

		if (createUser($conn, $inData["firstName"], $inData["lastName"], $inData["login"], $inData["password"])) {
			$userInfo = getUserInfoByLogin($conn, $login);
			returnWithInfo($userInfo["ID"]);
		} else {
			returnWithError("Error creating user");
			exit();
		}
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
		return $result->num_rows > 0;
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
		$retValue = '{"id":-1,"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $id )
	{
		$retValue = '{"id":' . $id . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
