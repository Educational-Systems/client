var login_form = document.getElementById("login-form");
var submit_btn = document.getElementById("submit-btn");

login_form.addEventListener('submit', function (e) {
    e.preventDefault();

    var data = {};
    var formData = new FormData(e.target);

    for (var [key, value] of formData.entries()) {
        data[key] = value;
    }

    const http = new XMLHttpRequest();
    const url = 'login.php';

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(data));

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(JSON.parse(http.responseText));
        }
    }

    return false;
});