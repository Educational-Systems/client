var login_form = document.getElementById("login-form");
var submit_btn = document.getElementById("submit-btn");
var response_block = document.getElementById("response-block");
var loading = document.getElementById("loading");

function toggle_loading(state) {
    state ? loading.style.display = "block" : loading.style.display = "none";
}

function toggle_response(state, data = null) {
    state ? response_block.style.visibility = "visible" : response_block.style.visibility = "hidden";

    if (data) {
        var html = ``;
        html += `<span style="color: ${data.database.success ? "green" : "red"};">${data.database.message}</span>`;
        html += `<br>`;
        html += `<span style="color: ${data.webnjit.success ? "green" : "red"};">${data.webnjit.message}</span>`;
        response_block.innerHTML = html;
    }

}

login_form.addEventListener('submit', function (e) {
    e.preventDefault();

    toggle_response(false);
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
            toggle_response(true, result);
            toggle_loading(false);
        }
    }

    return false;
});