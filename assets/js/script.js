var login_form = document.getElementById("login-form");
var submit_btn = document.getElementById("submit-btn");
var loading = document.getElementById("loading");

function toggle_loading(state) {
    state ? loading.style.display = "block" : loading.style.display = "none";
}

login_form.addEventListener('submit', function (e) {
    e.preventDefault();

    toggle_loading(true);

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
            var result = JSON.parse(http.responseText)
            console.log(result);
            toggle_loading(false);
        }
    }

    return false;
});