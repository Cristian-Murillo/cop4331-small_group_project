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

	var tmp = { firstName: firstName, lastName: lastName, login: login, password: password };
	var jsonPayload = JSON.stringify(tmp);

	var url ='/LAMPAPI/Register.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("registerResult").innerHTML = "Account has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("registerResult").innerHTML = err.message;
	}
	//i think this is how you add to
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
	var addFirst = document.getElementById("addFirstName").value;
	var addLast = document.getElementById("addLastName").value;
	var addEmail = document.getElementById("addEmail").value;
	var addPhone = document.getElementById("addPhoneNumber").value;

	// GHETTO format checker ;)
	for(var i = 0; i < addPhone.length; i++)
    {
        if( (addPhone[3] == " " && addPhone[7] == " ") && !isNaN(addPhone[i]))
        {
        }else{
            return;
        }

    }

	addPhone = "(" + addPhone[0]+addPhone[1]+addPhone[2]+")"+addPhone[4]+addPhone[5]+addPhone[6]
							+" "+addPhone[8]+addPhone[9]+addPhone[10]+addPhone[11];

	var tmp = { userId: userId, firstName: addFirst, lastName: addLast, email: addEmail,
		 					phoneNumber: addPhone};

	// var jsonPayload = JSON.stringify(tmp);
	//
	// var url = '/LAMPAPI/Add.' + extension;
	//
	// var xhr = new XMLHttpRequest();
	// xhr.open("POST", url, true);
	// xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	// try {
	// 	xhr.onreadystatechange = function () {
	// 		if (this.readyState == 4 && this.status == 200) {
	// 			document.getElementById("contactAddResult").innerHTML = "Contact has been added";
	// 		}
	// 	};
	// 	xhr.send(jsonPayload);
	// }
	// catch (err) {
	// 	document.getElementById("contactAddResult").innerHTML = err.message;
	// }

}

function searchContact() {
	var srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";

	var contactList = "";

	var tmp = { search: srch, userId: userId };
	var jsonPayload = JSON.stringify(tmp);

	var url = urlBase + '/SearchContacts.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				var jsonObject = JSON.parse(xhr.responseText);

				for (var i = 0; i < jsonObject.results.length; i++) {
					contactList += jsonObject.results[i];
					if (i < jsonObject.results.length - 1) {
						contactList += "<br />\r\n";
					}
				}

				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}
