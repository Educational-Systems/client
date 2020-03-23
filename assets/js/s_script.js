var loading = document.getElementById("loading");
var container = document.getElementById("container");

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


var submissions_list = [
    {
        "studentName": "Dzmitry",
        "examID": 1,
        "examName": "This is exam name.",
        "examDescription": "This is exam Description.",
        "studentID": 1,
        "status": 2,
        "autoGrade": 20,
        "grade": 20,
        "comments": "Well done!",
        "ID": 1,
        "questions": [
            {
                "name": "Q1",
                "description": "This is Question 1: addition.",
                "task": "Created function 'add' which will output the sum of two numbers.",
                "input1": "10, 20",
                "output1": "30",
                "input2": "-1, 2",
                "output2": "1",
                "solution": "def add(a,b): return a + b",
                "result1": "30",
                "result2": "1",
                "autoGrade": 20,
                "grade": 20,
                "comments": "Task well done!",
                "ID": 1
            },
            {
                "name": "Q1",
                "description": "This is Question 1: addition.",
                "task": "Created function 'add' which will output the sum of two numbers.",
                "input1": "10, 20",
                "output1": "30",
                "input2": "-1, 2",
                "output2": "1",
                "solution": "def add(a,b): return a + b",
                "result1": "30",
                "result2": "1",
                "autoGrade": 20,
                "grade": 20,
                "comments": "Task well done!",
                "ID": 1
            },
            {
                "name": "Q1",
                "description": "This is Question 1: addition.",
                "task": "Created function 'add' which will output the sum of two numbers.",
                "input1": "10, 20",
                "output1": "30",
                "input2": "-1, 2",
                "output2": "1",
                "solution": "def add(a,b): return a + b",
                "result1": "30",
                "result2": "1",
                "autoGrade": 20,
                "grade": 20,
                "comments": "Task well done!",
                "ID": 1
            }
        ]
    },
    {
        "studentName": "Dzmitry",
        "examID": 1,
        "examName": "This is exam name.",
        "examDescription": "This is exam Description.",
        "studentID": 1,
        "status": 0,
        "autoGrade": 0,
        "grade": 0,
        "comments": "",
        "ID": 2,
        "questions": [
            {
                "name": "Q1",
                "description": "This is Question 1: addition.",
                "task": "Created function 'add' which will output the sum of two numbers.",
                "input1": "10, 20",
                "output1": "30",
                "input2": "-1, 2",
                "output2": "1",
                "solution": "",
                "result1": "",
                "result2": "",
                "autoGrade": 0,
                "grade": 0,
                "comments": "",
                "ID": 1
            },
            {
                "name": "Q1",
                "description": "This is Question 1: addition.",
                "task": "Created function 'add' which will output the sum of two numbers.",
                "input1": "10, 20",
                "output1": "30",
                "input2": "-1, 2",
                "output2": "1",
                "solution": "def add(a,b): return a + b",
                "result1": "30",
                "result2": "1",
                "autoGrade": 20,
                "grade": 20,
                "comments": "Task well done!",
                "ID": 1
            },
            {
                "name": "Q1",
                "description": "This is Question 1: addition.",
                "task": "Created function 'add' which will output the sum of two numbers.",
                "input1": "10, 20",
                "output1": "30",
                "input2": "-1, 2",
                "output2": "1",
                "solution": "def add(a,b): return a + b",
                "result1": "30",
                "result2": "1",
                "autoGrade": 20,
                "grade": 20,
                "comments": "Task well done!",
                "ID": 1
            }
        ]
    },
    {
        "studentName": "Dzmitry",
        "examID": 1,
        "examName": "This is exam name.",
        "examDescription": "This is exam Description.",
        "studentID": 1,
        "status": 1,
        "autoGrade": 20,
        "grade": 0,
        "comments": "",
        "ID": 2,
        "questions": [
            {
                "name": "Q1",
                "description": "This is Question 1: addition.",
                "task": "Created function 'add' which will output the sum of two numbers.",
                "input1": "10, 20",
                "output1": "30",
                "input2": "-1, 2",
                "output2": "1",
                "solution": "def add(a,b): return a + b",
                "result1": "30",
                "result2": "1",
                "autoGrade": 20,
                "grade": 0,
                "comments": "",
                "ID": 1
            },
            {
                "name": "Q1",
                "description": "This is Question 1: addition.",
                "task": "Created function 'add' which will output the sum of two numbers.",
                "input1": "10, 20",
                "output1": "30",
                "input2": "-1, 2",
                "output2": "1",
                "solution": "def add(a,b): return a + b",
                "result1": "30",
                "result2": "1",
                "autoGrade": 20,
                "grade": 20,
                "comments": "Task well done!",
                "ID": 1
            }
        ]
    }
]


function home_view() {
    return `
    <div>
        <h2>Exams</h2>
        <div class="e-container">
            ${get_submissions()}
        </div>
    </div>
    `;
}

function exam_submission_view() {
    return `
    <div>
        <h2>Exam Submission</h2>
        <br>
        <div>
            <h3>${current_submission.studentName} | ${current_submission.examName}</h3>
            <h4>Auto-Grader: ${current_submission.autoGrade}</h4>
            <h4>Grade: ${current_submission.grade}</h4>
            <p>${current_submission.examDescription}</p>
        </div>
        <br>

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
    var result = "<h4>Assigned Exams:</h4>";

    for (var i = 0; i < current_submissions.length; i++) {
        result += `
            <div class="s-block">
                <div class="s-header">
                    <h4>${current_submissions[i].studentName} | ${current_submissions[i].status == 0 ? "New" : (current_submissions[i].status == 1) ? "Submitted" : "Graded"}</h4>
                    <p>${current_submissions[i].autoGrade} auto; ${current_submissions[i].grade} final.</p>
                    <p>${current_submissions[i].comments}</p>
                </div>
                <div class="s-actions">
                    <a onclick='navigate("exam_submission", ${i})'>${current_submissions[i].status == 0 ? "Take Exam" : (current_submissions[i].status == 1) ? "View Submission" : "View Grade"}</a>
                </div>
                <br>
            </div>
        `;
    }

    return result;
}

function get_submitted_questions() {
    var result = "<h4>Questions:</h4>";

    for (var i = 0; i < current_submission.questions.length; i++) {
        var temp_question = current_submission.questions[i];
        result += `
            <div class="s-block">
                <div class="answer-header">
                    <h3>${temp_question.name}</h3>
                    <h4>${temp_question.description}</h4>
                    <p>${temp_question.task}</p>
                    <p>Input/Output 1: ${temp_question.input1} => ${temp_question.output1}</p>
                    <p>Input/Output 2: ${temp_question.input2} => ${temp_question.output2}</p>
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
                <br>
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
    var data = { ...current_submission, token: localStorage.getItem("token") };

    const http = new XMLHttpRequest();
    var url = 'api/save_student_submission.php';

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
    nav_history.push(place);

    if (place != "exam_submission" && place != "exam_submissions") {
        current_exam = null;
        current_question = null;
        current_submissions = null;
        current_submission = null;
    }

    switch (place) {
        case "home": {
            nav_history = ["home"];

            toggle_loading(true);

            var data = { token: localStorage.getItem("token") };

            const http = new XMLHttpRequest();
            var url = 'api/get_user.php';

            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/json");
            http.send(JSON.stringify(data));

            http.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var result = JSON.parse(http.responseText);
                    current_user = result;

                    data = { token: localStorage.getItem("token") };
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
            current_submission = current_submissions[sup_data];
            container.innerHTML = exam_submission_view();
            break;
        }
    }
}

function go_back() {
    var location = nav_history[nav_history.length - 2];
    nav_history.splice(nav_history.length - 2);
    navigate(location);
}

/* <------------ Navigation <------------ */

navigate("home");