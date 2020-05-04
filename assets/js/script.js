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
    var pre_str = encodeURIComponent((str + '').toString());
    var result = pre_str;
    for (var i = 0; i < pre_str.length; i++) {
        result = result.replace('!', '%21')
            .replace("'", '%27')
            .replace('(', '%28')
            .replace(')', '%29')
            .replace('*', '%2A')
            .replace('+', '%20');
    }
    return result;
}

function urldecode(str) {
    var pre_str = decodeURIComponent((str + '').toString());
    var result = pre_str;
    for (var i = 0; i < pre_str.length; i++) {
        result = result.replace('%21', '!')
            .replace('%27', '\'')
            .replace('%28', '(')
            .replace('%29', ')')
            .replace('%2A', '*')
            .replace('%20', '+');
    }
    return result;
}

function middleTest() {
    var data = {};
    var solution = document.getElementById('test').value;
    var encoded_solution = urlencode(solution);
    var decoded_solution = urldecode(encoded_solution);

    data = {
        "questionID": "32",
        "points": "100",
        "function_name": "operation",
        "function_name_points": 10,
        "constraint": "elif",
        "constraint_points": 20,
        "colon_points": 10,
        "solution": encoded_solution,
        "input1": "'+', 1, 2",
        "input2": "'-', 3, 4",
        "input3": "'*', 7, 8",
        "input4": "'/', -1, 1",
        "input5": "'^', 2, 2",
        "input6": null,
        "output1": "3",
        "output2": "-1",
        "output3": "56",
        "output4": "-1.0",
        "output5": "-1",
        "output6": null,
        "output1_points": 10,
        "output2_points": 10,
        "output3_points": 10,
        "output4_points": 10,
        "output5_points": 10,
        "output6_points": null
    };

    const http = new XMLHttpRequest();
    const url = `https://web.njit.edu/~dsk43/cs490-middle/grade_question.php`;

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