<?php
	$inData = getRequestInfo();

	$str = $inData["search"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "ContactManager");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$rows = getRowsContainingString($conn, $str);
		$numResults = count($rows);

		if ($numResults < 1) {
			returnWithError("No records found");
			exit();
		} else {
			returnWithInfo($rows, $numResults);
		}

		$conn->close();
	}

	function getRowsContainingString($conn, $str)
	{
		$result = $conn->query("SELECT * FROM contacts WHERE ContactFirstName LIKE '%$str%' OR ContactLastName LIKE '%$str%' OR Email LIKE '%$str%' OR Phone LIKE '%$str%'");
		$rows = array();
		$index = 0;
		while ($record = $result->fetch_assoc()) {
			$rows[$index] = $record;
			$index++;
		}
		return $rows;
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
		$retValue = '{"results":[],"numResults":0,"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo($searchResultsArr, $numResults)
	{
		$searchResultsJSON = json_encode($searchResultsArr);
		$retValue = '{"results":' . $searchResultsJSON . ',"numResults":' . $numResults . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
