//let urlBase = "" the hyperlink to server
let userInfo;
let passInfo;
let userId = 0;
let firstName = "";
let lastName = "";


function saveInfo() {
    userInfo = document.getElementById("user").value;
    passInfo = document.getElementById("pass").value;
    //next two line makes the input blank for error
    document.getElementById("user").value = "";
    document.getElementById("pass").value = "";

    
    let newUrl = urlBase + '/userInfo';
    let json = JSON.stringigy(newUrl);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = funtion();
        {
            if(this.readyState == 4 && this.status == 200)
            {
                let jsonOb = JSON.parse(xhr.responseText);
                userId = jsonOb.id;
                
                if(userId < 1)
                {
                    document.getElementById("error").innerHTML = "User/Pass is incorrect";
                }

            }
        }
    }



}