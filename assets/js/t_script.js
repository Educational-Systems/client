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

/* ------------> State Variables ------------> */
var current_user = {
    "full_name": "Theodore Nicholson",
    "first_name": "Theodore",
    "last_name": "Nicholson",
    "email": "teacher@test.com",
    "type": "1",
    "type_string": "teacher",
    "token": "teach_token"
}

var current_exam = null;
var current_question = null;
var current_submissions = null;
var current_submission = null;

var new_exam = {
    "name": "",
    "description": "",
    "questions": []
}

var new_question = {
    "name": "",
    "description": "",
    "task": "",
    "input1": "",
    "output1": "",
    "input2": "",
    "output2": ""
}

var new_submission = {
    "studentID": null,
    "status": 0,
    "autoGrade": 0,
    "grade": 0,
    "comments": "",
    "questions": []
}

var new_sub_question = {
    "questionID": null,
    "solution": "",
    "result1": "",
    "result2": "",
    "autoGrade": 0,
    "grade": 0,
    "comments": ""
}

var exams_list = [
    {
        "name": "Exam 1",
        "description": "This is Exam 1",
        "questions": [
            {
                "questionID": 1,
                "points": 20
            }
        ],
        "ID": 1
    },
    {
        "name": "Exam 2",
        "description": "This is Exam 2",
        "questions": [
            {
                "questionID": 2,
                "points": 10
            },
            {
                "questionID": 3,
                "points": 10
            }
        ],
        "ID": 2
    },
    {
        "name": "Exam 3",
        "description": "This is Exam 3",
        "questions": [
            {
                "questionID": 2,
                "points": 20
            }
        ],
        "ID": 3
    }
]

var questions_list = [
    {
        "name": "Q1",
        "description": "This is Question 1: addition.",
        "task": "Created function 'add' which will output the sum of two numbers.",
        "input1": "10, 20",
        "output1": "30",
        "input2": "-1, 2",
        "output2": "1",
        "ID": 1
    },
    {
        "name": "Q2",
        "description": "This is Question 2: multiplication.",
        "task": "Created function 'mult' which will output the multiplication of two numbers.",
        "input1": "2, 5",
        "output1": "10",
        "input2": "3, 7",
        "output2": "21",
        "ID": 2
    },
    {
        "name": "Q3",
        "description": "This is Question 3: power.",
        "task": "Created function 'pow' which will output number to the power of 2.",
        "input1": "4",
        "output1": "16",
        "input2": "4",
        "output2": "16",
        "ID": 3
    }
]

var students_list = [
    {
        "name": "Dzmitry",
        "ID": 1
    },
    {
        "name": "Noah",
        "ID": 2
    },
    {
        "name": "David",
        "ID": 3
    }
]

var submissions_list = [
    [
        {
            "studentName": "Dzmitry",
            "studentID": 1,
            "status": 2,
            "autoGrade": 20,
            "grade": 20,
            "comments": "Well done!",
            "ID": 1,
            "questions": [
                {
                    "questionID": 1,
                    "solution": "def add(a,b): return a + b",
                    "result1": "30",
                    "result2": "1",
                    "autoGrade": 20,
                    "grade": 20,
                    "comments": "Task well done!"
                }
            ]
        },
        {
            "studentName": "Noah",
            "studentID": 2,
            "status": 0,
            "autoGrade": 0,
            "grade": 0,
            "comments": "",
            "ID": 2,
            "questions": [
                {
                    "questionID": 1,
                    "solution": "",
                    "result1": "",
                    "result2": "",
                    "autoGrade": 0,
                    "grade": 0,
                    "comments": ""
                }
            ]
        }
    ],
    [
        {
            "studentName": "Noah",
            "studentID": 2,
            "status": 0,
            "autoGrade": 0,
            "grade": 0,
            "comments": "",
            "ID": 2,
            "questions": [
                {
                    "questionID": 2,
                    "solution": "",
                    "result1": "",
                    "result2": "",
                    "autoGrade": 0,
                    "grade": 0,
                    "comments": ""
                },
                {
                    "questionID": 3,
                    "solution": "",
                    "result1": "",
                    "result2": "",
                    "autoGrade": 0,
                    "grade": 0,
                    "comments": ""
                }
            ]
        }
    ],
    []
]

function get_question_by_ID(ID) {
    for (var i = 0; i < questions_list.length; i++) {
        if (questions_list[i].ID == ID) {
            return questions_list[i];
        }
    }

    return null;
}

function get_question_status(ID) {
    for (var i = 0; i < current_exam.questions.length; i++) {
        if (current_exam.questions[i].questionID == ID) {
            return current_exam.questions[i];
        }
    }

    return null;
}

function get_assignment_status(ID) {
    for (var i = 0; i < current_submissions.length; i++) {
        if (current_submissions[i].studentID == ID) {
            return true;
        }
    }

    return false;
}

/* <------------ State Variables <------------ */




/* ------------> Views Functions ------------> */

function home_view() {
    return `
    <div>
        <h2>Home</h2>
        <div>
            <h4>Welcome ${current_user.full_name}!</h4>
        </div>
        <div class="nav-container">
            <a onclick='navigate("exams")'>Exams</a>
            <a onclick='navigate("questions")'>Questions</a>
        </div>
    </div>
    `;
}

function exams_view() {
    return `
    <div>
        <h2>Exams</h2>
        <div class="act-container">
            <a onclick='navigate("home")'>Go Home</a>
            <a onclick='navigate("exam_create")'>Create Exam</a>
        </div>
        <div class="e-container">
            ${get_exams()}
        </div>
    </div>
    `;
}

function questions_view() {
    return `
    <div>
        <h2>Questions</h2>
        <div class="act-container">
            <a onclick='navigate("home")'>Go Home</a>
            <a onclick='navigate("question_create")'>Create Question</a>
        </div>
        <div class="q-container">
            ${get_questions()}
        </div>
    </div>
    `;
}

function exam_create_view() {
    return `
    <div>
        <h2>Create Exam</h2>
        ${get_exam_data()}
    </div>
    `;
}

function exam_edit_view() {
    return `
    <div>
        <h2>Edit Exam</h2>
        ${get_exam_data()}
    </div>
    `;
}

function question_create_view() {
    return `
    <div>
        <h2>Create Question</h2>
        ${get_question_data()}
    </div>
    `;
}

function question_edit_view() {
    return `
    <div>
        <h2>Edit Question</h2>
        ${get_question_data()}
    </div>
    `;
}

function exam_submissions_view() {
    return `
    <div>
        <h2>Exam Submissions</h2>
        <div class="act-container">
            <a onclick='go_back()'>Go Back</a>
        </div>
        <br>
        <div>
            <h3>${current_exam.name}</h3>
            <p>${current_exam.description}</p>
        </div>
        <br>
        <div id="submissions_container" class="s-container">
            ${get_submissions()}
        </div>
        <div class="stud-list"> 
            ${get_students()}
        </div>
    </div>
    `;
}

function exam_submission_view() {
    return `
    <div>
        <h2>Exam Submission</h2>
        <div class="act-container">
            <a onclick='go_back()'>Go Back</a>
        </div>

        <br>
        <div>
            <h3>${current_submission.studentName} | ${current_exam.name}</h3>
            <h4>Auto-Grader: ${current_submission.autoGrade}</h4>
            <p>${current_exam.description}</p>
        </div>
        <br>

        <div class="submission-container">
            ${get_submitted_questions()}
        </div>
        
        <div class="input">
            <label for="final_grade">Final Grade:</label>
            <input type="text" name="final_grade" placeholder="Type Final Grade" value="${current_submission ? current_submission.grade : ""}" onchange="change_submission_field('grade', this.value)" />
        </div>
        <div class="input">
            <label for="submission_comments">Comments:</label>
            <input type="text" name="submission_comments" placeholder="Type Submission Comments" value="${current_submission ? current_submission.comments : ""}" onchange="change_submission_field('comments', this.value)" />
        </div>

        <div class="form-buttons">
            <button class="button" onclick='save_submission()'>Grade Exam</button>
            <button class="button" onclick='go_back()'>Cancel</button>
        </div>
    </div>
    `;
}

/* <------------ Views Functions <------------ */




/* ------------> Helper Functions ------------> */

function get_exams() {
    var result = "";
    for (var i = 0; i < exams_list.length; i++) {
        result += `
        <div class="e-block">
            <div class="q-header">
                <h4>${exams_list[i].name}</h4>
                <p>${exams_list[i].description}</p>
            </div>
            <div class="e-actions">
                <a onclick='navigate("exam_submissions", ${exams_list[i].id})'>View Submissions</a>
                <a onclick='navigate("exam_edit", ${i})'>Edit Exam</a>
                <a>Delete Exam</a>
            </div>
        </div>
        `;
    }
    return result;
}

function get_exam_data() {
    return `
            <div>
                <br>
                <h4>Exam Information:</h4>

                <div class="input">
                    <label for="exam_name">Name</label>
                    <input type="text" name="exam_name" placeholder="Type Exam Name" value="${current_exam ? current_exam.name : ""}" onchange="change_exam_field('name', this.value)" />
                </div>
                <div class="input">
                    <label for="exam_description">Description</label>
                    <input type="text" name="exam_description" placeholder="Type Exam Description" value="${current_exam ? current_exam.description : ""}" onchange="change_exam_field('description', this.value)" />
                </div>

                <br>

                <div class="q-selector" id="questions_list">
                    ${get_questions_selector()}
                </div>                

                <div class="form-buttons">
                    <button class="button" onclick='save_exam()'>Save Exam</button>
                    <button class="button" onclick='go_back()'>Cancel</button>
                </div>
            </div>
    `;
}

function get_questions() {
    var result = "";
    for (var i = 0; i < questions_list.length; i++) {
        result += `
        <div class="q-block">
            <div class="q-header">
                <h4>${questions_list[i].name}</h4>
                <p>${questions_list[i].description}</p>
            </div>
            <div class="q-actions">
                <a onclick='navigate("question_edit", ${i})'>Edit Question</a>
                <a>Delete Question</a>
            </div>
        </div>
        `;
    }
    return result;
}

function get_questions_selector() {
    var result = "<h4>Exam Questions:</h4>";

    for (var i = 0; i < questions_list.length; i++) {
        var temp_question = questions_list[i];
        var temp_status = get_question_status(temp_question.ID);
        var is_applied = temp_status ? true : false;

        result += `
            <div class="q-selection">
                <input type="checkbox" ${is_applied ? "checked" : ""} onchange="add_question(this.checked, ${temp_question.ID})">
                <label><b>${temp_question.name}</b></label>
                <p>${temp_question.description}</p>
                
                <div class="input">
                    <input type="number" step="1" placeholder="Total Points" onchange="change_points(this.value, ${temp_question.ID})" ${!is_applied ? "style='display: none;'" : ""} value="${temp_status ? temp_status.points : ""}" required />
                </div>
            </div>
        `;
    }

    return result;
}

function get_question_data() {
    return `
            <div>
                <br>
                <h4>Question Information:</h4>
                <div class="input">
                    <label for="question_name">Name</label>
                    <input type="text" name="question_name" placeholder="Type Question Name" value="${current_question ? current_question.name : ""}" onchange="change_question_field('name', this.value)" />
                </div>
                <div class="input">
                    <label for="question_description">Description</label>
                    <input type="text" name="question_description" placeholder="Type Question Description" value="${current_question ? current_question.description : ""}" onchange="change_question_field('description', this.value)" />
                </div>
                <div class="input">
                    <label for="question_task">Task</label>
                    <input type="text" name="question_task" placeholder="Type Question Task" value="${current_question ? current_question.task : ""}" onchange="change_question_field('task', this.value)" />
                </div>
                <div class="input">
                    <label for="question_input1">Input 1</label>
                    <input type="text" name="question_input1" placeholder="Type Question Input 1" value="${current_question ? current_question.input1 : ""}" onchange="change_question_field('input1', this.value)" />
                </div>
                <div class="input">
                    <label for="question_output1">Output 1</label>
                    <input type="text" name="question_output1" placeholder="Type Question Output 1" value="${current_question ? current_question.output1 : ""}" onchange="change_question_field('output1', this.value)" />
                </div>
                <div class="input">
                    <label for="question_input2">Input 2</label>
                    <input type="text" name="question_input2" placeholder="Type Question Input 2" value="${current_question ? current_question.input2 : ""}" onchange="change_question_field('input2', this.value)" />
                </div>
                <div class="input">
                    <label for="question_output2">Output 2</label>
                    <input type="text" name="question_output2" placeholder="Type Question Output 2" value="${current_question ? current_question.output2 : ""}" onchange="change_question_field('output2', this.value)" />
                </div>

                <br>

                <div class="form-buttons">
                    <button class="button" onclick='save_question()'>Save Question</button>
                    <button class="button" onclick='go_back()'>Cancel</button>
                </div>
            </div>
    `;
}

function get_submissions() {
    var result = "<h4>Submissions:</h4>";

    for (var i = 0; i < current_submissions.length; i++) {
        result += `
            <div class="s-block">
                <div class="s-header">
                    <h4>${current_submissions[i].studentName} | ${current_submissions[i].status == 0 ? "New" : (current_submissions[i].status == 1) ? "Submitted" : "Graded"}</h4>
                    <p>${current_submissions[i].autoGrade} auto; ${current_submissions[i].grade} final.</p>
                    <p>${current_submissions[i].comments}</p>
                </div>
                <div class="s-actions">
                    <a onclick='navigate("exam_submission", ${i})'>Grade Submission</a>
                </div>
                <br>
            </div>
        `;
    }

    return result;
}

function get_students() {
    var result = "";

    var result = "<h4>Assign to Students:</h4>";

    for (var i = 0; i < students_list.length; i++) {
        var temp_student = students_list[i];
        var temp_status = get_assignment_status(temp_student.ID);
        var is_applied = temp_status ? true : false;

        result += `
            <div class="stud-selection">
                <input type="checkbox" ${is_applied ? "checked" : ""} onchange="add_student(this.checked, ${temp_student.ID}, '${temp_student.name}')">
                <label><b>${temp_student.name}</b></label>
            </div>
        `;
    }

    return result;
}

function get_submitted_questions() {
    var result = "<h4>Questions:</h4>";

    for (var i = 0; i < current_submission.questions.length; i++) {
        var temp_question_result = current_submission.questions[i];
        var temp_question = get_question_by_ID(temp_question_result.questionID);

        result += `
            <div class="s-block">
                <div class="answer-header">
                    <h3>${temp_question.name}</h3>
                    <h4>${temp_question.description}</h4>
                    <p>${temp_question.task}</p>
                </div>
                <div class="answer">
                    <h4>Answer:</h4>
                    <p>${temp_question_result.solution}</p>
                    <p>Output 1: ${temp_question_result.result1}</p>
                    <p>Output 2: ${temp_question_result.result2}</p>
                    <p>Auto-Grader: ${temp_question_result.autoGrade}</p>
                    <div class="input">
                        <label>Grade</label>
                        <input type="text" placeholder="Type Question Grade" value="${temp_question_result ? temp_question_result.grade : ""}" onchange="change_question_grade_field(${i}, 'grade', this.value)" />
                    </div>
                    <div class="input">
                        <label>Comments</label>
                        <input type="text" placeholder="Type Question Comments" value="${temp_question_result ? temp_question_result.comments : ""}" onchange="change_question_grade_field(${i}, 'comments', this.value)" />
                    </div>
                </div>
                <br>
            </div>
        `;
    }

    return result;
}

/* <------------ Helper Functions <------------ */




/* ------------> Logic Functions ------------> */

function add_question(value, ID) {
    if (value) {
        current_exam.questions.push({
            questionID: ID,
            points: 0
        });
    } else {
        for (var i = 0; i < current_exam.questions.length; i++) {
            if (current_exam.questions[i].questionID == ID) {
                current_exam.questions.splice(i, 1);
                break;
            }
        }
    }

    document.getElementById("questions_list").innerHTML = get_questions_selector();
}

function change_points(value, ID) {
    for (var i = 0; i < current_exam.questions.length; i++) {
        if (current_exam.questions[i].questionID == ID) {
            current_exam.questions[i].points = Number(value);
            break;
        }
    }
}

function add_student(value, ID, name) {
    if (value) {
        current_submissions.push({
            ...new_submission,
            studentName: name,
            studentID: ID,
            questions: current_exam.questions.map(x => {
                return {
                    ...new_sub_question,
                    questionID: x.ID
                }
            })
        });
    } else {
        for (var i = 0; i < current_submissions.length; i++) {
            if (current_submissions[i].studentID == ID) {
                current_submissions.splice(i, 1);
                break;
            }
        }
    }

    document.getElementById("submissions_container").innerHTML = get_submissions();
}

function change_exam_field(field, value) {
    current_exam[field] = value;
}

function change_question_field(field, value) {
    current_question[field] = value;
}

function change_submission_field(field, value) {
    current_submission[field] = value;
}

function change_question_grade_field(i, field, value) {
    current_submission.questions[i][field] = value;
}

function save_exam() {
    console.log(current_exam);
    var data = { ...current_exam, token: localStorage.getItem("token") };

    const http = new XMLHttpRequest();
    const url = 'api/save_exam.php';

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(data));

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //var result = JSON.parse(http.responseText);
            //console.log(result);
            toggle_loading(false);
            navigate("exams");
        }
    }
}

function save_question() {
    console.log(current_question);
    var data = { ...current_question, token: localStorage.getItem("token") };

    const http = new XMLHttpRequest();
    const url = 'api/save_question.php';

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(data));

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //var result = JSON.parse(http.responseText);
            //console.log(result);
            toggle_loading(false);
            navigate("questions");
        }
    }
}

function save_submission() {
    console.log(current_submission);
    var data = { ...current_submission, token: localStorage.getItem("token") };

    const http = new XMLHttpRequest();
    const url = 'api/save_teacher_submission.php';

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(data));

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //var result = JSON.parse(http.responseText);
            //console.log(result);
            toggle_loading(false);
            navigate("exam_submissions", current_exam.ID);
        }
    }
}

/* <------------ Logic Functions <------------ */




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
            const url = 'api/get_user.php';

            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/json");
            http.send(JSON.stringify(data));

            http.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var result = JSON.parse(http.responseText);
                    current_user = result;

                    toggle_loading(false);
                    container.innerHTML = home_view();
                }
            }

            break;
        }
        case "exams": {
            toggle_loading(true);

            var data = { token: localStorage.getItem("token") };

            const http = new XMLHttpRequest();
            const url = 'api/get_exams.php';

            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/json");
            http.send(JSON.stringify(data));

            http.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var result = JSON.parse(http.responseText);
                    exams_list = result;

                    toggle_loading(false);
                    container.innerHTML = exams_view();
                }
            }

            break;
        }
        case "questions": {
            toggle_loading(true);

            var data = { token: localStorage.getItem("token") };

            const http = new XMLHttpRequest();
            const url = 'api/get_questions.php';

            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/json");
            http.send(JSON.stringify(data));

            http.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var result = JSON.parse(http.responseText);
                    questions_list = result;

                    toggle_loading(false);
                    container.innerHTML = questions_view();
                }
            }
            break;
        }
        case "exam_create": {
            toggle_loading(true);

            var data = { token: localStorage.getItem("token") };

            const http = new XMLHttpRequest();
            const url = 'api/get_questions.php';

            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/json");
            http.send(JSON.stringify(data));

            http.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var result = JSON.parse(http.responseText);
                    questions_list = result;

                    toggle_loading(false);
                    current_exam = copy(new_exam);
                    container.innerHTML = exam_create_view();
                }
            }
            break;
        }
        case "exam_edit": {
            toggle_loading(true);

            var data = { token: localStorage.getItem("token") };

            const http = new XMLHttpRequest();
            const url = 'api/get_questions.php';

            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/json");
            http.send(JSON.stringify(data));

            http.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var result = JSON.parse(http.responseText);
                    questions_list = result;

                    toggle_loading(false);
                    current_exam = exams_list[sup_data];
                    console.log(current_exam);
                    container.innerHTML = exam_edit_view();
                }
            }
            break;
        }
        case "question_create": {
            current_question = copy(new_question);
            container.innerHTML = question_create_view();
            break;
        }
        case "question_edit": {
            current_question = questions_list[sup_data];
            container.innerHTML = question_edit_view();
            break;
        }
        case "exam_submissions": {
            toggle_loading(true);

            var data = { token: localStorage.getItem("token"), examID: sup_data };

            const http = new XMLHttpRequest();
            var url = 'api/get_exam_submissions.php';

            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/json");
            http.send(JSON.stringify(data));

            http.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var result = JSON.parse(http.responseText);
                    submissions_list = result;

                    data = { token: localStorage.getItem("token") };
                    url = 'api/get_students.php';

                    http.open("POST", url, true);
                    http.setRequestHeader("Content-type", "application/json");
                    http.send(JSON.stringify(data));

                    http.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            var result = JSON.parse(http.responseText);
                            students_list = result;

                            toggle_loading(false);
                            current_submission = null;

                            if (data != null) {
                                current_exam = exams_list[sup_data];
                                current_submissions = submissions_list[sup_data];
                            }

                            container.innerHTML = exam_submissions_view();
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