var loading = document.getElementById("loading");
var container = document.getElementById("container");
var title_dom = document.getElementById("title");

function c_alert(text) {
    document.getElementById("notification_text").innerText = text;
    document.getElementById("notification").style.display = "flex";
    setTimeout(function () {
        document.getElementById("notification").style.display = "none";
    }, 3000);
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

var pre_url = "";

function toggle_loading(state) {
    state ? loading.style.display = "block" : loading.style.display = "none";
}

function merge(obj1, obj2) {
    var result = {};

    for (var i in obj1) {
        result[i] = obj1[i];
    }

    for (var i in obj2) {
        result[i] = obj2[i];
    }

    return result;
}

function copy(obj1) {
    var result = {};

    for (var i in obj1) {
        result[i] = obj1[i];
    }

    return result;
}

var current_user = null;
var current_submissions = null;
var current_submission = null;


var submissions_list = []


function home_view() {
    return `
    <div>
        <h2>Assigned Exams:</h2>
        <div class="e-container">
            ${get_submissions()}
        </div>
    </div>
    `;
}

function exam_submission_view() {
    return `
    <div>
        <h2>Exam Submission:</h2>
        <div>
            <h3 style="margin: 10px 0px;">${current_submission.examName}</h3>
            <p style="margin: 10px 0px; margin-top: -5px;">${current_submission.examDescription}</p>
        </div>

        ${current_submission.status == 2 ? `<table class="results-table" style="margin-top: 10px;">
            <tr>
                <td>Exam grade:</td>
                <th>${current_submission.grade}</th>
            </tr>
            ${current_submission.comments != '' ? `<tr>
                <td>Exam comments:</td>
                <th>${current_submission.comments}</th>
            </tr>`: ``}
        </table>`: ``}

        <div class="submission-container">
            ${get_submitted_questions()}
        </div>

        <div class="form-buttons" style="margin-top: 20px;">
            <button class="button" style="${current_submission.status != 0 ? "display: none;" : ""}" onclick='save_submission()'>Submit Exam</button>
            <button class="button" onclick='go_back()'>Exit</button>
        </div>
    </div>
    `;
}

function get_submissions() {
    var result = "";

    for (var i = 0; i < current_submissions.length; i++) {
        result += `
            <div class="s-block">
                <div class="s-header">
                    <h4>${current_submissions[i].examName} | ${current_submissions[i].status == 0 ? "New" : (current_submissions[i].status == 1 || current_submissions[i].status == 2) ? "Submitted" : "Graded"}</h4>
                    <p>${current_submissions[i].examDescription}</p>
                    ${current_submissions[i].status == 3 ? `<p>Grade: ${current_submissions[i].grade}</p>` : ``}
                </div>
                <div class="s-actions">
                    <a class="new-button" onclick='navigate("exam_submission", ${i})'>${current_submissions[i].status == 0 ? "Take Exam" : (current_submissions[i].status == 1 || current_submissions[i].status == 2) ? "View Submission" : "View Grade"}</a>
                </div>
            </div>
        `;
    }

    return result;
}

function get_temp_questions(temp_question_result, j) {
    var result = ``;

    for (var i = 1; i <= 6; i++) {
        if (temp_question_result['input' + i]) {
            result += `
                        <tr>
                            <td>Test case ${i}</td>
                            <td>In: ${temp_question_result["input" + i]} Out: ${temp_question_result["output" + i]}</td>
                            <td>${temp_question_result["result" + i] ? temp_question_result["result" + i] : "No result"}</td>
                            <td>
                                <span>${temp_question_result["result" + i + "_points"]} / ${temp_question_result["output" + i + "_points"]}</span>
                            </td>
                        </tr>
                        `;
        }
    }

    return result;
}

function get_points(temp_q) {
    var total_t_points = Number(temp_q.colon_points) + Number(temp_q.constraint_points) + Number(temp_q.function_name_points);

    for (var j = 1; j <= 6; j++) {
        if (temp_q["input" + j]) {
            total_t_points += Number(temp_q["output" + j + "_points"]);
        }
    }

    var total_r_points = Number(temp_q.colon_result_points) + Number(temp_q.constraint_result_points) + Number(temp_q.function_name_result_points);

    for (var j = 1; j <= 6; j++) {
        if (temp_q["input" + j]) {
            total_r_points += Number(temp_q["result" + j + "_points"]);
        }
    }

    return [total_t_points, total_r_points];
}

function get_submitted_questions() {
    var result = "";

    for (var i = 0; i < current_submission.questions.length; i++) {
        var points = get_points(current_submission.questions[i]);

        if (!Number(current_submission.questions[i].points)) {
            current_submission.questions[i].points = points[0];
        }

        var temp_question = current_submission.questions[i];
        result += `
            <div class="s-block" style="flex-direction: column; align-items: flex-start;">
                <div class="answer-header">
                    <h3>${temp_question.name} | ${current_submission.status != 2 ? `${temp_question.points} max points` : `${temp_question.grade} points`}</h3>
                    <p style="margin-top: 5px; margin-bottom: 5px;">${temp_question.task}</p>

                    <div class="points-container">
                        <div class="points-block">
                            ${temp_question.function_name ? `<p>Required function name: <b>${temp_question.function_name}</b></p>` : ""}
                        </div>
                        <div class="points-block">
                            ${temp_question.constraint ? `<p>Required constraint: <b>${temp_question.constraint}</b></p>` : ""}
                        </div>
                    </div>
                </div>
                <div class="answer" style="width: 100%">                    
                    <div class="input textarea-input" style="${current_submission.status != 0 ? "display: none;" : ""}">
                        <label for="question_task">Solution</label>
                        <textarea name="question_task" style="height: 100px;" placeholder="Type Question Solution" onchange="change_question_solution_field(${i}, 'solution', this.value)">${temp_question ? urldecode(temp_question.solution) : ""}</textarea>
                    </div>

                    <h4 style="${current_submission.status == 0 ? "display: none;" : "margin-bottom: 5px;"}">Solution:</h4>
                    <textarea readonly style="${current_submission.status == 0 ? "display: none; width: 100%;" : "width: 100%; height: 100px;"}">${temp_question ? urldecode(temp_question.solution) : ""}</textarea>

                    ${Number(current_submission.status) == 2 ? `<table class="results-table" style="margin-top: 10px;">
                        <tr>
                            <th>Task:</th>
                            <th>Expected:</th>
                            <th>Result:</th>
                            <th>Points:</th>
                        </tr>
                        <tr>
                            <td>Colon</td>
                            <td>Should be included</td>
                            <td>${temp_question.colon_result == "true" ? "Pass" : "Fail"}</td>
                            <td>
                                <span>${temp_question.colon_result_points} / ${temp_question.colon_points}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Constraint</td>
                            <td>${temp_question.constraint != "" ? temp_question.constraint : "None"}</td>
                            <td>${temp_question.constraint_result == "true" ? "Pass" : "Fail"}</td>
                            <td>
                                <span>${temp_question.constraint_result_points} / ${temp_question.constraint_points}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>Funtion name</td>
                            <td>${temp_question.function_name}</td>
                            <td>${temp_question.function_name_result == "true" ? "Pass" : "Fail"}</td>
                            <td>
                                <span>${temp_question.function_name_result_points} / ${temp_question.function_name_points}</span>
                            </td>
                        </tr>

                        ${get_temp_questions(temp_question, i)}

                        <tr>
                            <td>Total</td>
                            <td colspan="2">
                                <span>Comments: ${temp_question ? temp_question.comments : ""}</span>
                            </td>
                            <td>
                                <span>${temp_question.grade} / ${temp_question.points}</span>
                            </td>
                        </tr>
                    </table>` : ``}
                </div>
            </div>
        `;
    }

    return result;
}

function change_question_solution_field(i, field, value) {
    current_submission.questions[i][field] = value;
}

function save_submission() {
    console.log(current_submission);
    var data = { ...current_submission, token: sessionStorage.getItem("token") };

    for (var i = 0; i < data.questions.length; i++) {
        data.questions[i].solution = urlencode(data.questions[i].solution);
    }

    const http = new XMLHttpRequest();
    var url = pre_url + 'api/save_student_submission.php';

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(data));

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            toggle_loading(false);
            c_alert("Exam successfully submitted!");
            navigate("home");
        }
    }
}

/* ------------> Navigation ------------> */

var nav_history = [];

function navigate(place, sup_data = null) {
    var title = "Home";
    nav_history.push(place);

    if (place != "exam_submission" && place != "exam_submissions") {
        current_exam = null;
        current_question = null;
        current_submissions = null;
        current_submission = null;
    }

    switch (place) {
        case "log_out": {
            sessionStorage.removeItem("token");
            window.location.href = "index.html";
        }
        case "home": {
            title = "Home";
            nav_history = ["home"];

            toggle_loading(true);

            var data = { token: sessionStorage.getItem("token") };

            const http = new XMLHttpRequest();
            var url = pre_url + 'api/get_user.php';

            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/json");
            http.send(JSON.stringify(data));

            http.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var result = JSON.parse(http.responseText);
                    current_user = result;

                    data = { token: sessionStorage.getItem("token") };
                    url = 'api/get_user_exams.php';

                    http.open("POST", url, true);
                    http.setRequestHeader("Content-type", "application/json");
                    http.send(JSON.stringify(data));

                    http.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            result = JSON.parse(http.responseText);
                            current_submissions = result;
                            container.innerHTML = home_view();
                            toggle_loading(false);
                        }
                    }
                }
            }

            break;
        }
        case "exam_submission": {
            title = "Exam Submission";
            current_submission = current_submissions[sup_data];
            container.innerHTML = exam_submission_view();
            break;
        }
    }

    title_dom.innerText = title;
}

function go_back() {
    var location = nav_history[nav_history.length - 2];
    nav_history.splice(nav_history.length - 2);
    navigate(location);
}

/* <------------ Navigation <------------ */

navigate("home");