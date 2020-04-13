var loading = document.getElementById("loading");
var container = document.getElementById("container");
var title_dom = document.getElementById("title");

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
            <h3>${current_submission.examName}</h3>
            <h4>Auto-Grader: ${current_submission.autoGrade}</h4>
            <h4>Grade: ${current_submission.grade}</h4>
            <p>${current_submission.examDescription}</p>
        </div>

        <div class="submission-container">
            ${get_submitted_questions()}
        </div>

        <div class="form-buttons">
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
                    <h4>${current_submissions[i].examName} | ${current_submissions[i].status == 0 ? "New" : (current_submissions[i].status == 1) ? "Submitted" : "Graded"}</h4>
                    <p>${current_submissions[i].autoGrade} auto; ${current_submissions[i].grade} final</p>
                    <p>${current_submissions[i].comments}</p>
                </div>
                <div class="s-actions">
                    <a class="new-button" onclick='navigate("exam_submission", ${i})'>${current_submissions[i].status == 0 ? "Take Exam" : (current_submissions[i].status == 1) ? "View Submission" : "View Grade"}</a>
                </div>
            </div>
        `;
    }

    return result;
}

/*
name: "While Loop"
description: null
task: "Create function get_all which will get all"
solution: ""
function_name: "test"
function_name_points: "0"
constraint: "for"
constraint_points: "0"
colon_points: "0"
input1: "1"
input2: "1"
input3: "1"
input4: "1"
input5: "1"
input6: "1"
output1: "1"
output2: "1"
output3: "1"
output4: "1"
output5: "1"
output6: "1"
result1: ""
result2: ""
result3: ""
result4: ""
result5: ""
result6: ""
function_name_result: ""
colon_result: ""
constraint_result: ""
output1_points: ""
output2_points: ""
output3_points: ""
output4_points: ""
output5_points: ""
output6_points: ""
result1_points: "0"
result2_points: "0"
result3_points: "0"
result4_points: "0"
result5_points: "0"
result6_points: "0"
function_name_result_points: "0"
colon_result_points: "0"
constraint_result_points: "0"
autoGrade: "0"
grade: "0"
comments: ""
ID: "28"
output1_result: null
output2_result: null
output3_result: null
output4_result: null
output5_result: null
output6_result: null
*/

function get_submitted_questions() {
    var result = "";

    for (var i = 0; i < current_submission.questions.length; i++) {
        var temp_question = current_submission.questions[i];
        result += `
            <div class="s-block">
                <div class="answer-header">
                    <h3>${temp_question.name}</h3>

                    ${temp_question.description != null ? `<h4>${temp_question.description}</h4>` : ""}

                    <p style="margin-top: 5px; margin-bottom: 5px;">${temp_question.task}</p>

                    <div class="points-container">
                        <div class="points-block">
                        ${temp_question.input1 ? `<p>Input/Output 1: ${temp_question.input1} => ${temp_question.output1} <br>Points: ${temp_question.output1_points}</p>` : ""}
                        ${temp_question.input2 ? `<p>Input/Output 2: ${temp_question.input2} => ${temp_question.output2} <br>Points: ${temp_question.output2_points}</p>` : ""}
                        ${temp_question.function_name ? `<p>Function Name: ${temp_question.function_name} <br>Points: ${temp_question.function_name_points}</p>` : ""}
                        </div>
                        <div class="points-block">
                        ${temp_question.input3 ? `<p>Input/Output 3: ${temp_question.input3} => ${temp_question.output3} <br>Points: ${temp_question.output3_points}</p>` : ""}
                        ${temp_question.input4 ? `<p>Input/Output 4: ${temp_question.input4} => ${temp_question.output4} <br>Points: ${temp_question.output4_points}</p>` : ""}
                        ${temp_question.constraint ? `<p>Constraint: ${temp_question.constraint} <br>Points: ${temp_question.constraint_points}</p>` : ""}
                        </div>
                        <div class="points-block">
                        ${temp_question.input5 ? `<p>Input/Output 5: ${temp_question.input5} => ${temp_question.output5} <br>Points: ${temp_question.output5_points}</p>` : ""}
                        ${temp_question.input6 ? `<p>Input/Output 6: ${temp_question.input6} => ${temp_question.output6} <br>Points: ${temp_question.output6_points}</p>` : ""}
                        ${temp_question.colon_points ? `<p>Colon Points: ${temp_question.colon_points}</p>` : ""}
                        </div>
                    </div>
                
                </div>
                <div class="answer">
                    <div class="input" style="${current_submission.status != 0 ? "display: none;" : ""}">
                        <label>Solution:</label>
                        <input type="text" placeholder="Type Question Solution" value="${temp_question ? temp_question.solution : ""}" onchange="change_question_solution_field(${i}, 'solution', this.value)" />
                    </div>
                    <div class="results" style="${current_submission.status == 0 ? "display: none;" : ""}">
                        <p>Solution: ${temp_question.solution}</p>
                        <p>Result 1: ${temp_question.result1}</p>
                        <p>Result 2: ${temp_question.result2}</p>
                        <p>Auto-Grader: ${temp_question.autoGrade}</p>
                        <p>Final Grade: ${temp_question.grade}</p>
                    </div>
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

    const http = new XMLHttpRequest();
    var url = pre_url + 'api/save_student_submission.php';

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(data));

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //var result = JSON.parse(http.responseText);
            //console.log(result);
            toggle_loading(false);
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