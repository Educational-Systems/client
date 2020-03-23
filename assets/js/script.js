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

function middleTest() {
    var data = {};

    data = {
        "questionID": 1,
        "points": 20, // Max amount of points
        "solution": "def add(a,b): return a + b",
        "input1": "2, 5",
        "output1": "7", // Expected output
        "input2": "3, 7",
        "output2": "21" // Expected output
    }

    const http = new XMLHttpRequest();
    const url = 'api/middle_test.php';

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(data));

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(http.responseText)
            console.log(result);
        }
    }
}

function unauthorizedTest() {
    var data = { "nontoken": "faild" };

    const http = new XMLHttpRequest();
    const url = 'api/unathorized.php';

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(data));

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(http.responseText)
            console.log(result);
        }
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
                window.location.href = "teacher.html";
                toggle_loading(false);
            } else {
                window.location.href = "student.html";
                toggle_loading(false);
            }
        }
    }

    return false;
});