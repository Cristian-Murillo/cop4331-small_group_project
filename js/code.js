var urlBase = 'contactsrus.xyz';//
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

var conID = 0;
var conFirstName = "";
var conLastName = "";
var conEmail = "";
var conPhone = 0;

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
				if (userId < 1) {
					document.getElementById("PasswordError").innerHTML = jsonObject.error;
					setTimeout(function() {
						document.getElementById("PasswordError").innerHTML = "";
					}, 3000);
					return;
				}
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				saveCookie();
				window.location.href = "login.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("PasswordError").innerHTML = err.message;
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

	for(var i = 0; i < addPhone.length; i++)
    {
        if( (!isNaN(addPhone[i])) ) {
			
        }
		else{
			document.getElementById("addPhoneNumber").innerHTML = "";
			document.getElementById("errorResult").innerHTML = "Phone number field accepts only numbers";
			setTimeout(function() {
				document.getElementById("errorResult").innerHTML = "";
			}, 3000);
			return;
		}
    }


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
				var jsonObject = JSON.parse(xhr.responseText);
				if(jsonObject.id >= 1) {
					document.getElementById("contactAddResult").innerHTML = "Contact being added";
					setTimeout(function() {
						document.getElementById("contactAddResult").innerHTML = "";
						searchContact();
					}, 2000);
				}
				else { 
					document.getElementById("errorResult").innerHTML = jsonObject.error;
					setTimeout(function() {
						document.getElementById("errorResult").innerHTML = "";
					}, 2000);
				}
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("errorResult").innerHTML = jsonObject.error;
	}

	document.getElementById("addFirstName").value = null;
	document.getElementById("addLastName").value = null;
	document.getElementById("addEmail").value = null;
	document.getElementById("addPhoneNumber").value = null;

	
	
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

function searchContact() {
	srch = document.getElementById("searchText").value;
	console.log(srch);
	
	document.getElementById("contactSearchResult").innerHTML = "";
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
					var phn = object.Phone;
					if(phn.length == 10) {
						phn = "(" +object.Phone[0]+object.Phone[1]+object.Phone[2]+") "+object.Phone[3]+object.Phone[4]+object.Phone[5]+"-"+object.Phone[6]+object.Phone[7]+object.Phone[8]+object.Phone[9];
					}
				  	
					entry.appendChild(document.createTextNode(
						object.ContactFirstName + " " +
						object.ContactLastName + "\n " +
						phn + "    " +
						object.Email));

					var btn = document.createElement("BUTTON");       // Create a <button> element
            		btn.style.float = "right" // Bind button to right of entry
					btn.id = object.ID;
					btn.FirstName = object.ContactFirstName;
					btn.lastName = object.ContactLastName;
					btn.Email = object.Email;
					btn.Phone = object.Phone;
					btn.innerHTML = '<img src="resources/delete.png" alt = "del" width="10" height="10" />';
					
					var btn2 = document.createElement("BUTTON");    //create button for edit
                    btn2.style.float = "right";
                    btn2.id = object.ID;
					btn2.FirstName = object.ContactFirstName;
					btn2.lastName = object.ContactLastName;
					btn2.Email = object.Email;
					btn2.Phone = object.Phone;
                    btn2.innerHTML = '<img src="resources/edit.png" alt = "del" width="10" height="10" />';
                    entry.appendChild(btn2);
                    btn2.addEventListener("click", function(e)  {
                        conID = this.id;
						conFirstName = this.FirstName;
						conLastName = this.lastName;
						conEmail = this.Email;
						conPhone = this.Phone;
						revealEdit();
                    });
            		entry.appendChild(btn);
					btn.addEventListener("click", function(e)  {
						deleteContact(this.id, this.FirstName, this.lastName, this.Email, this.Phone);
					});

					list.appendChild(entry);
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
			document.getElementById("contactDeleteResult").innerHTML = "Contact being deleted";
			setTimeout(function() {
				document.getElementById("contactDeleteResult").innerHTML = "";
				searchContact();
			}, 1500);
		}
	};
	xhr.send(jsonPayload);
	}
	catch (err) {
	document.getElementById("contactDeleteResult").innerHTML = err.message;
	}
	
	conID = 0;
	conFirstName = "";
	conLastName = "";
	conEmail = "";
	conPhone = 0;
	
	
}
function unRevealEdit() {
	
	conID = 0;
	conFirstName = "";
	conLastName = "";
	conEmail = "";
	conPhone = 0;
	document.getElementById("editFirstName").value = null;
	document.getElementById("editLastName").value = null;
	document.getElementById("editPhoneNumber").value = null;
	document.getElementById("editEmail").value = null;
	document.getElementById("editContent").style.display="none";
}

function revealEdit(){
	
	document.getElementById("editContent").style.display = "block";
	document.getElementById("editFirstName").value = conFirstName;
	document.getElementById("editLastName").value = conLastName;
	document.getElementById("editEmail").value = conEmail;
	document.getElementById("editPhoneNumber").value = conPhone;
}

function editContact(){
    var FirstName = document.getElementById("editFirstName").value;
    var LastName = document.getElementById("editLastName").value;
    var Email = document.getElementById("editEmail").value;
    var Phone = document.getElementById("editPhoneNumber").value;

    for(var i = 0; i < Phone.length;i++){
        if(isNaN(Phone[i])){
            document.getElementById("errorResult").innerHTML="Phone is invalid"
			setTimeout(function() {
				document.getElementById("errorResult").innerHTML = "";
			}, 1500);
            return;
        }
    }
    var tmp = { UserID: userId, ID: conID, FirstName: FirstName, LastName: LastName, Email: Email, PhoneNumber: Phone};

    var jsonPayload = JSON.stringify(tmp);

    var url = '/LAMPAPI/Update.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
            document.getElementById("contactEditResult").innerHTML = "Contact being updated";
			setTimeout(function() {
				document.getElementById("contactEditResult").innerHTML = "";
				searchContact();
			}, 1500);
        }
    };
    xhr.send(jsonPayload);
    }
    catch (err) {
    document.getElementById("contactEditResult").innerHTML = err.message;
    }
	
	unRevealEdit();
	
	
}




function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }
  
  function isCharacterALetter(char) {
	return (/[a-zA-Z]/).test(char)
  }
  

const carouselText = [
	{text: "add.", color: "LightSteelBlue"},
	{text: "search.", color: "LightSteelBlue"},
	{text: "edit.", color: "LightSteelBluee"},
	{text: "delete.", color: "LightSteelBlue"}
]


$( document ).ready(async function() {
carousel(carouselText, "#feature-text")
});

async function typeSentence(sentence, eleRef, delay = 100) {
	const letters = sentence.split("");
	let i = 0;
	while(i < letters.length) {
		await waitForMs(delay + 40 * Math.random());
		$(eleRef).append(letters[i]);
		if (letters[i+1] == ' ')
		{
		i++
		continue;
		}
		else if (letters[i+1] == '.' || letters[i+1] == ',')
		{
		await waitForMs(delay + 60 + 50 * Math.random());
		}
		else if (isCharacterALetter(letters[i+1]) != 1)
		{
		await waitForMs(delay + 20 + 40 * Math.random());
		}
		else;
		i++
	}
	return;
}

async function deleteSentence(eleRef) {
	const sentence = $(eleRef).html();
	const letters = sentence.split("");
	let i = 0;
	while(letters.length > 0) {
		await waitForMs(100);
		letters.pop();
		$(eleRef).html(letters.join(""));
	}
}

async function carousel(carouselList, eleRef) {
	var i = 0;
	while(true) {
	updateFontColor(eleRef, carouselList[i].color)
	await typeSentence(carouselList[i].text, eleRef);
	await waitForMs(1500);
	await deleteSentence(eleRef);
	await waitForMs(500);
	i++
	if(i >= carouselList.length) {i = 0;}
	}
}

function updateFontColor(eleRef, color) {
	$(eleRef).css('color', color);
}

function waitForMs(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}



