var urlBase = 'contactrus.com';//
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin() {
	var user = document.getElementById("user").value;
	var pass = document.getElementById("pass").value;
	//	var hash = md5( password );

	var tmp = { login: user, password: pass };
	//	var tmp = {login:login,password:hash};
	var jsonPayload = JSON.stringify(tmp);

	var url = urlBase + '/Login.' + extension;

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
// Keeping function just in case
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



function doRegister() {
	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;
	var login = document.getElementById("user").value;
	var password = document.getElementById("password").value;
	var verifyPass = document.getElementById("varpassword").value;

	if(password != verifyPass)
	{
		document.getElementById("PasswordError").innerHTML = "Password does't match";
		return;
	}
	var tmp = { firstName: firstName, lastName: lastName, login: login, password: password,  passwordConfirm: verifyPass};
	var jsonPayload = JSON.stringify(tmp);

	var url = urlBase + '/Login.' + extension;

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
	var addFirst = document.getElementById("addFirstName").value;
	var addLast = document.getElementById("addLastName").value;
	var addEmail = document.getElementById("addEmail").value;
	var addPhone = document.getElementById("addPhoneNumber").value;

	// GHETTO format checker ;)
	for(var i = 0; i < addPhone.length; i++)
    {
        if( (!isNaN(addPhone[i])) )
        {
        }else{
            return;
        }

    }

	// addPhone = "(" + addPhone[0]+addPhone[1]+addPhone[2]+")"+addPhone[4]+addPhone[5]+addPhone[6]
	// 						+" "+addPhone[8]+addPhone[9]+addPhone[10]+addPhone[11];

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
	searchContact();
}
function onLoad() {
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
	searchContact();
}
function TEST() {

	alert(firstName + lastName + userId);
}

function searchContact() {
	var srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	var button;
	var contactList = "";

	var tmp = { search: srch, id: userId };


	var jsonPayload = JSON.stringify(tmp);

	var url = '/LAMPAPI/Search.' + extension;
	alert(userId);
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
				// for (var i = 0; i < jsonObject.results.length; i++) {
				// 	entry = document.createElement('li');
				// 	contact = jsonObject.results[i].ContactFirstName + "  " + jsonObject.results[i].ContactLastName + " " +
				// 	jsonObject.results[i].Email + " " + jsonObject.results[i].Phone + " ";
				//
				// 	// alert(contact);
				//
				// 	entry.appendChild(document.createTextNode(contact));
				// 	list.appendChild(entry);
				//
				// 	// if (i < jsonObject.results.length - 1) {
				// 	// 	contactList += "<br />\r\n";
				// 	// }
				// }
				for (var i = 0; i < jsonObject.results.length; i++) {
            var object = jsonObject.results[i];
          	var entry = document.createElement('li');
						entry.appendChild(document.createTextNode(object.ContactFirstName));
						list.appendChild(entry);

						var btn = document.createElement("BUTTON");       // Create a <button> element
            btn.fn = object.ContactFirstName;
            var t = document.createTextNode("Delete");       // Create a text node
            btn.appendChild(t);         // Append the text to <button>
            list.appendChild(btn);
          }


				// document.getElementsByTagName("ul")[1].innerHTML = list;

			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}

}
