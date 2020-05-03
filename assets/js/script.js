var login_form = document.getElementById("login-form");
var submit_btn = document.getElementById("submit-btn");
var response_block = document.getElementById("response-block");
var loading = document.getElementById("loading");

var pre_url = "";

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

function urlencode(str) {
    str = (str + '').toString();
    return encodeURIComponent(str)
        .replace('!', '%21')
        .replace('\'', '%27')
        .replace('(', '%28')
        .replace(')', '%29')
        .replace('*', '%2A')
        .replace('+', '%20');
}

function urldecode(str) {
    str = (str + '').toString();
    return decodeURIComponent(str)
        .replace('%21', '!')
        .replace('%27', '\'')
        .replace('%28', '(')
        .replace('%29', ')')
        .replace('%2A', '*')
        .replace('%20', '+');
}
function middleTest() {
    var data = {};
    var solution = document.getElementById('test').value;
    var encoded_solution = urlencode(solution);
    var decoded_solution = urldecode(encoded_solution);

    data = { "questionID": "32", "points": "77", "function_name": "add", "function_name_points": 1, "constraint": "print", "constraint_points": 2, "colon_points": 3, "input1": "1, 2", "input2": "3, 4", "input3": "7, 8", "input4": "-1, 1", "input5": "2, 2", "input6": "0, 0", "output1": "3", "output2": "7", "output3": "15", "output4": "0", "output5": "4", "output6": "0", "output1_points": 4, "output2_points": 5, "output3_points": 6, "output4_points": 7, "output5_points": 8, "output6_points": 9 };

    const http = new XMLHttpRequest();
    const url = pre_url + 'api/middle_test.php?solution=' + encoded_solution;

    console.log(solution);
    console.log(encoded_solution);
    console.log(decoded_solution);
    console.log(url);

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
    const url = pre_url + 'api/unauthorized.php';

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(data));

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(http.responseText)
            console.log(result);
        } else {
            console.log("Something is wrong, man.", result);
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
    const url = pre_url + 'api/login.php';

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(data));

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(http.responseText)
            console.log(result);
            sessionStorage.setItem("token", result.token);
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