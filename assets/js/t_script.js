var loading = document.getElementById("loading");
var container = document.getElementById("container");

function toggle_loading(state) {
    state ? loading.style.display = "block" : loading.style.display = "none";
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

var exams_list = [
    {
        "name": "Exam 1",
        "description": "This is Exam 1",
        "ID": "1"
    },
    {
        "name": "Exam 2",
        "description": "This is Exam 2",
        "ID": "2"
    },
    {
        "name": "Exam 3",
        "description": "This is Exam 3",
        "ID": "3"
    }
]

var questions_list = [
    {
        "name": "Exam 1 Q1",
        "desc": "This is Question 1 of the Exam 1",
        "ID": "1",
        "examID": "1"
    },
    {
        "name": "Exam 1 Q2",
        "desc": "This is Question 2 of the Exam 1",
        "ID": "2",
        "examID": "1"
    },
    {
        "name": "Exam 2 Q1",
        "desc": "This is Question 1 of the Exam 2",
        "ID": "3",
        "examID": "2"
    },
    {
        "name": "Exam 2 Q2",
        "desc": "This is Question 2 of the Exam 2",
        "ID": "4",
        "examID": "2"
    },
    {
        "name": "Exam 2 Q3",
        "desc": "This is Question 3 of the Exam 2",
        "ID": "5",
        "examID": "2"
    },
    {
        "name": "Exam 3 Q1",
        "desc": "This is Question 1 of the Exam 3",
        "ID": "6",
        "examID": "3"
    }
]

/* <------------ State Variables <------------ */




/* ------------> Views Functions ------------> */

function home_view(user) {
    return `
    <div>
        <h2>Home</h2>
        <p>Welcome ${user.name}!</p>
        <div class="nav-container">
            <a onclick='navigate("exams")'>Exams</a>
            <a onclick='navigate("questions")'>Questions</a>
        </div>
    </div>
    `;
}

function exams_view(exams) {
    return `
    <div>
        <h2>Exams</h2>
        <div class="act-container">
            <a onclick='navigate("home")'>Go Home</a>
            <a onclick='navigate("exam_create")'>Create Exam</a>
        </div>
        <div class="e-container">
            ${get_exams(exams)}
        </div>
    </div>
    `;
}

function questions_view(questions) {
    return `
    <div>
        <h2>Questions</h2>
        <div class="act-container">
            <a onclick='navigate("home")'>Go Home</a>
            <a onclick='navigate("question_create")'>Create Question</a>
        </div>
        <div class="q-container">
            ${get_questions(questions)}
        </div>
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
    </div>
    `;
}

function exam_create_view() {
    return `
    <div>
        <h2>Create Exam</h2>
        <div class="act-container">
            <a onclick='go_back()'>Go Back</a>
        </div>
        ${get_exam_data(exam)}
    </div>
    `;
}

function exam_edit_view(exam) {
    return `
    <div>
        <h2>Edit Exam</h2>
        <div class="act-container">
            <a onclick='go_back()'>Go Back</a>
        </div>
        ${get_exam_data(exam)}
    </div>
    `;
}

function question_create_view() {
    return `
    <div>
        <h2>Create Question</h2>
        <div class="act-container">
            <a onclick='go_back()'>Go Back</a>
        </div>
    </div>
    `;
}

function question_edit_view() {
    return `
    <div>
        <h2>Edit Question</h2>
        <div class="act-container">
            <a onclick='go_back()'>Go Back</a>
        </div>
    </div>
    `;
}

/* <------------ Views Functions <------------ */




/* ------------> Helper Functions ------------> */

function get_exams(exams) {
    var result = "";
    for (var i = 0; i < exams.length; i++) {
        result += `
        <div class="e-block">
            <p>${exams[i]}</p>
            <div class="e-actions">
                <a onclick='navigate("exam_submissions")'>View Submissions</a>
                <a onclick='navigate("exam_edit")'>Edit Exam</a>
                <a>Delete Exam</a>
            </div>
        </div>
        `;
    }
    return result;
}

function get_questions(questions) {
    var result = "";
    for (var i = 0; i < questions.length; i++) {
        result += `
        <div class="q-block">
            <p>${questions[i]}</p>
            <div class="q-actions">
                <a onclick='navigate("question_edit")'>Edit Question</a>
                <a>Delete Question</a>
            </div>
        </div>
        `;
    }
    return result;
}

/* <------------ Helper Functions <------------ */




/* ------------> Navigation ------------> */

var nav_history = [];

function navigate(place) {
    nav_history.push(place);

    switch (place) {
        case "home": {
            nav_history = ["home"];
            container.innerHTML = home_view({ name: "Dzmitry" });
            break;
        }
        case "exams": {
            container.innerHTML = exams_view(["Exam 1", "Exam 2"]);
            break;
        }
        case "questions": {
            container.innerHTML = questions_view(["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]);
            break;
        }
        case "exam_create": {
            container.innerHTML = exam_create_view();
            break;
        }
        case "exam_submissions": {
            container.innerHTML = exam_submissions_view();
            break;
        }
        case "exam_edit": {
            container.innerHTML = exam_edit_view();
            break;
        }
        case "question_create": {
            container.innerHTML = question_create_view();
            break;
        }
        case "question_edit": {
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