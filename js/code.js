var urlBase = 'contactsrus.xyz';//
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin() {
	var login = document.getElementById("user").value;
	var password = document.getElementById("password").value;
	//	var hash = md5( password );

	var tmp = { login: login, password: password };
	//	var tmp = {login:login,password:hash};
	var jsonPayload = JSON.stringify(tmp);

	var url ='/LAMPAPI/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;

				if (userId < 1) {
					document.getElementById("loginResult").innerHTML = "User/Password is incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "contact.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function welcoming(){
	var data = document.cookie;
	var splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}
	document.getElementById("welcome").innerHTML = "Welcome " + firstName + " " + lastName;
}

function doSignIn() {
	window.location.href = "login.html";
}


function doRegister() {
	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;
	var login = document.getElementById("user").value;
	var password = document.getElementById("password").value;
	var verifyPass = document.getElementById("varpassword").value;

	if(password != verifyPass) {	
		document.getElementById("PasswordError").innerHTML = "Password doesn't match";
		return;
	}
	var tmp = { firstName: firstName, lastName: lastName, login: login, password: password,  passwordConfirm: verifyPass};
	var jsonPayload = JSON.stringify(tmp);

	var url ='/LAMPAPI/Register.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;
				if (userId > 1) {
					document.getElementById("loginResult").innerHTML = "Account already exist";
					return;
				}
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				saveCookie();
				window.location.href = "contact.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message; 
	}
}

function saveCookie() {
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) {
		window.location.href = "index.html";
	}
	else {
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact() {
	alert("IN ADD");
	var addFirst = document.getElementById("addFirstName").value;
	var addLast = document.getElementById("addLastName").value;
	var addEmail = document.getElementById("addEmail").value;
	var addPhone = document.getElementById("addPhoneNumber").value;

	// for(var i = 0; i < addPhone.length; i++)
    // {
    //     if( (!isNaN(addPhone[i])) ) {
	// 		alert("IN IF ELSE IM A NUMBER");
    //     }
	// 	else{ 
	// 		document.getElementById("addPhoneNumber").innerHTML = "";
	// 		document.getElementById("contactAddResult").innerHTML = "Phone number accepts only numbers";
	// 	}
    // }

	// if(addFirst == "" || addLast == "" || addEmail == "" || addPhone == "" ) {
	// 	alert("IN IF ELSE IF EMPTY");
	// 	document.getElementById("contactAddResult").innerHTML = "Fill out all entries";
	// }

	document.getElementById("addFirstName").innerHTML = "";
	document.getElementById("addLastName").innerHTML = "";
	document.getElementById("addEmail").innerHTML = "";
	document.getElementById("addPhoneNumber").innerHTML = "";

	var tmp = { id: userId, addFirstName: addFirst, addLastName: addLast, addEmail: addEmail,
		 					addPhoneNumber: addPhone};

	var jsonPayload = JSON.stringify(tmp);
	var url = '/LAMPAPI/Add.' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	alert("ABOUT TO SEARCH IN ADD CONTACT");
	// searchContact();
}

function onLoad() {
	alert("IN ONLOAD");
	var data = document.cookie;
	var splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}
}

function searchContact() {
	alert("IN SEARCH");
	var srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	var button;
	var contactList = "";

	var tmp = { search: srch, id: userId };
	var jsonPayload = JSON.stringify(tmp);

	var url = '/LAMPAPI/Search.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				var jsonObject = JSON.parse(xhr.responseText);

				var list = document.getElementById('contactSearchRes');
				list.innerHTML = "";
				
				for (var i = 0; i < jsonObject.results.length; i++) {
					var object = jsonObject.results[i];
          			var entry = document.createElement('li');
					entry.appendChild(document.createTextNode(object.ContactFirstName+ " " + object.ContactLastName + " " +
					object.Phone + " " + object.Email) );
					list.appendChild(entry);
					
					var btn = document.createElement("BUTTON");       // Create a <button> element
            		
					btn.id = object.ID;
					btn.FirstName = object.ContactFirstName;
					btn.lastName = object.ContactLastName;
					btn.Email = object.Email;
					btn.Phone = object.Phone;
            		btn.innerText = "DELETE";
					
            		list.appendChild(btn);

					btn.addEventListener("click", function(e)  {
						deleteContact(this.id, this.FirstName, this.lastName, this.Email, this.Phone );
						
					});
          		}
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}	
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("errorResult").innerHTML = err.message;
	}
}

function deleteContact(deleteID, deleteFirstName, deleteLastName, deleteEmail, deletePhone) {
	alert("IN DELETE");
	if( !confirm("Do you want to delete " + deleteFirstName + " " + deleteLastName + "?") ) {
		return;
	}

	var tmp = { id: userId, deleteFirstName: deleteFirstName, deleteLastName: deleteLastName, deleteEmail: deleteEmail,
		deletePhoneNumber: deletePhone};

	var jsonPayload = JSON.stringify(tmp);

	var url = '/LAMPAPI/Delete.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
			document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted";
		}
	};
	xhr.send(jsonPayload);
	}
	catch (err) {
	document.getElementById("contactDeleteResult").innerHTML = err.message;
	}
	alert("ABOUT TO SEARCH IN DELETE");
	searchContact();
}