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
    } else {
        response_block.innerHTML =
            `<span>null</span>
            <br>
            <span>null</span>`;
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

    /*if(data.username == "teacher") {
        window.location.href = window.location.href.replace("index", "teacher");
        toggle_loading(false);
    } else {
        window.location.href = window.location.href.replace("index", "student");
        toggle_loading(false);
    }*/

    const http = new XMLHttpRequest();
    const url = 'api/login.php';

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(data));

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(http.responseText)
            console.log(result);
            localStorage.setItem("token", result.token);
            if (result.type == 1) {
                window.location.href = "teacher";
                toggle_loading(false);
            } else {
                window.location.href = "student";
                toggle_loading(false);
            }
        }
    }

    return false;
});