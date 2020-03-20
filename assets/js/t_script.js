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

var new_exam = {
    "name": "",
    "description": "",
    "questions": []
}

var current_question = null;

var new_question = {
    "name": "",
    "description": "",
    "task": "",
    "input": "",
    "output": ""
}

var current_submissions = null;

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
    "grade": 0,
    "comments": ""
}

var exams_list = [
    {
        "name": "Exam 1",
        "description": "This is Exam 1",
        "ID": 1
    },
    {
        "name": "Exam 2",
        "description": "This is Exam 2",
        "ID": 2
    },
    {
        "name": "Exam 3",
        "description": "This is Exam 3",
        "ID": 3
    }
]

var exams_data_list = [
    {
        "questions": [
            {
                "questionID": 1,
                "points": 20
            }
        ]
    },
    {
        "questions": [
            {
                "questionID": 2,
                "points": 10
            },
            {
                "questionID": 3,
                "points": 10
            }
        ]
    },
    {
        "questions": [
            {
                "questionID": 2,
                "points": 20
            }
        ]
    }
]

var questions_list = [
    {
        "name": "Q1",
        "description": "This is Question 1: addition.",
        "task": "Created function 'add' which will output the sum of two numbers.",
        "ID": 1
    },
    {
        "name": "Q2",
        "description": "This is Question 2: multiplication.",
        "task": "Created function 'mult' which will output the multiplication of two numbers.",
        "ID": 2
    },
    {
        "name": "Q3",
        "description": "This is Question 3: power.",
        "task": "Created function 'pow' which will output number to the power of 2.",
        "ID": 3
    }
]

var questions_data_list = [
    {
        "input": "10, 20",
        "output": "30"
    },
    {
        "input": "2, 5",
        "output": "10"
    },
    {
        "input": "4",
        "output": "16"
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
                    "grade": 0,
                    "comments": ""
                },
                {
                    "questionID": 3,
                    "solution": "",
                    "grade": 0,
                    "comments": ""
                }
            ]
        }
    ],
    []
]

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
        <h2>Exam Submissions</h2>
        <div class="act-container">
            <a onclick='go_back()'>Go Back</a>
        </div>
        <div>
            <h3>${current_exam.name}</h3>
            <p>${current_exam.description}</p>
        </div>
        <div class="s-container">
            ${get_submissions()}
        </div>
    </div>
    `;
}

/* <------------ Views Functions <------------ */




/* ------------> Helper Functions ------------> */

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
                <a onclick='navigate("exam_submissions", ${i})'>View Submissions</a>
                <a onclick='navigate("exam_edit", ${i})'>Edit Exam</a>
                <a>Delete Exam</a>
            </div>
        </div>
        `;
    }
    return result;
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
                    <label for="question_input">Input</label>
                    <input type="text" name="question_input" placeholder="Type Question Input" value="${current_question ? current_question.input : ""}" onchange="change_question_field('input', this.value)" />
                </div>
                <div class="input">
                    <label for="question_output">Output</label>
                    <input type="text" name="question_output" placeholder="Type Question Output" value="${current_question ? current_question.output : ""}" onchange="change_question_field('output', this.value)" />
                </div>

                <br>

                <div class="form-buttons">
                    <button class="button" onclick='save_question()'>Save Question</button>
                    <button class="button" onclick='go_back()'>Cancel</button>
                </div>
            </div>
    `;
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

/* <------------ Helper Functions <------------ */




/* ------------> Logic Functions ------------> */

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

    console.log(current_submissions);
    document.getElementById("submissions_container").innerHTML = get_submissions();
}

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

function change_exam_field(field, value) {
    current_exam[field] = value;
}

function change_question_field(field, value) {
    current_question[field] = value;
}

function save_exam() {
    console.log(current_exam);
}

function save_question() {
    console.log(current_question);
}

/* <------------ Logic Functions <------------ */




/* ------------> Navigation ------------> */

var nav_history = [];

function navigate(place, data = null) {
    nav_history.push(place);

    if (place != "exam_submission" && place != "exam_submissions") {
        current_exam = null;
        current_question = null;
        current_submissions = null;
    }


    switch (place) {
        case "home": {
            nav_history = ["home"];
            container.innerHTML = home_view();
            break;
        }
        case "exams": {
            container.innerHTML = exams_view();
            break;
        }
        case "questions": {
            container.innerHTML = questions_view();
            break;
        }
        case "exam_submissions": {
            current_exam = merge(exams_list[data], exams_data_list[data]);
            current_submissions = submissions_list[data];
            container.innerHTML = exam_submissions_view();
            break;
        }
        case "exam_submission": {
            current_submission = current_submissions[data];
            container.innerHTML = exam_submission_view();
            break;
        }
        case "exam_create": {
            current_exam = copy(new_exam);
            container.innerHTML = exam_create_view();
            break;
        }
        case "exam_edit": {
            current_exam = merge(exams_list[data], exams_data_list[data]);
            container.innerHTML = exam_edit_view();
            break;
        }
        case "question_create": {
            current_question = copy(new_question);
            container.innerHTML = question_create_view();
            break;
        }
        case "question_edit": {
            current_question = merge(questions_list[data], questions_data_list[data]);
            container.innerHTML = question_edit_view();
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