var loading = document.getElementById("loading");
var container = document.getElementById("container");
var title_dom = document.getElementById("title");

var pre_url = "http://localhost:8080/";

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
var current_user = null;

var topics = [];
var difficulties = [];
var constraints = [];

var current_exam = null;
var current_question = null;
var current_submissions = null;
var current_submission = null;
var current_filter = null

var exams_list = [];
var questions_list = [];
var filtered_questions_list = [];
var students_list = [];
var submissions_list = [];

var new_filter = {
    "keyword": "",
    "difficultyID": 0,
    "topicID": 0
}

var new_exam = {
    "name": "",
    "description": "",
    "questions": []
}

var new_question = {
    "name": "",
    "description": "",
    "task": "",
    "function_name": "",
    "topicID": 0,
    "difficultyID": 0,
    "constraintID": 0,
    "input1": "",
    "output1": "",
    "input2": "",
    "output2": "",
    "input3": "",
    "output3": "",
    "input4": "",
    "output4": "",
    "input5": "",
    "output5": "",
    "input6": "",
    "output6": ""
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
        <h2>Welcome ${current_user.full_name}!</h2>
        <div class="block-body">
            <h4>Please, select desired page:</h4>
            <ul>
                <li>For the exam creating, editing, assigning and grading, navigate to the "Exams" page.</li>
                <li>For the question creating and editing, navigate to the "Questions" page.</li>
            </ul>
        </div>
    </div>
    `;
}

function exams_view() {
    return `
    <div>
        <div class="act-container">
            <a class="new-button btn-action" onclick='navigate("exam_create")'>Create Exam</a>
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
        <div class="act-container">
            <a class="new-button btn-action" onclick='navigate("question_create")'>Create Question</a>
            <div class="filter">
            
                <div class="input">
                    <label for="difficultyID_filter">Difficulty</label>
                    <select id="difficultyID_filter" value="${current_filter ? Number(current_filter.difficultyID) : 0}" onchange="change_filter('difficultyID', this.value, 1)">
                        ${get_difficulties()}
                    </select>
                </div>
                <div class="input">
                    <label for="topicID_filter">Topic</label>
                    <select id="topicID_filter" value="${current_filter ? Number(current_filter.topicID) : 0}" onchange="change_filter('topicID', this.value, 1)">
                        ${get_topics()}
                    </select>
                </div>
                <div class="input">
                    <label for="keyword_filter">Keyword</label>
                    <input type="text" name="keyword_filter" id="keyword_filter" placeholder="Type Keyword" value="${current_filter ? current_filter.keyword : ""}" onchange="change_filter('keyword', this.value, 1)" />
                </div>
                <a class="new-button btn-action" onclick='reset_filter(1)'>Reset</a>
            </div>
        </div>
        <div class="q-container" id="questions-container">
            ${get_questions()}
        </div>
    </div>
    `;
}

function exam_create_view() {
    return `
    <div>
        ${get_exam_data()}
    </div>
    `;
}

function exam_edit_view() {
    return `
    <div>
        ${get_exam_data()}
    </div>
    `;
}

function question_create_view() {
    return `
    <div>
        ${get_question_data()}
    </div>
    `;
}

function question_edit_view() {
    return `
    <div>
        ${get_question_data()}
    </div>
    `;
}

function exam_submissions_view() {
    return `
    <div>
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
                <a class="new-button" onclick='navigate("exam_submissions", ${exams_list[i].id}, ${i})'>View Submissions</a>
                <a class="new-button" onclick='navigate("exam_edit", ${i})'>Edit Exam</a>
            </div>
        </div>
        `;
    }
    return result;
}

function get_exam_data() {
    return `
            <div>
                <div class="act-container">
                    <h3>General Information:</h3>
                </div>
                <div class="general-container">
                <div class="general-block">
                <div class="input">
                    <label for="exam_name">Name</label>
                    <input type="text" name="exam_name" placeholder="Type Exam Name" value="${current_exam ? current_exam.name : ""}" onchange="change_exam_field('name', this.value)" />
                </div>
                <div class="input">
                    <label for="exam_description">Description</label>
                    <input type="text" name="exam_description" placeholder="Type Exam Description" value="${current_exam ? current_exam.description : ""}" onchange="change_exam_field('description', this.value)" />
                </div>
                </div>
                </div>

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
    for (var i = 0; i < filtered_questions_list.length; i++) {
        result += `
        <div class="q-block">
            <div class="q-header">
                <h4>${filtered_questions_list[i].name}</h4>
                <p>${filtered_questions_list[i].description}</p>
            </div>
            <div class="q-actions">
                <a class="new-button" onclick='navigate("question_edit", ${i})'>Edit Question</a>
            </div>
        </div>
        `;
    }
    return result;
}

function get_questions_selector() {
    var result = "<h4>Exam Questions:</h4>";

    for (var i = 0; i < filtered_questions_list.length; i++) {
        var temp_question = filtered_questions_list[i];
        var temp_status = get_question_status(temp_question.ID);
        var is_applied = temp_status ? true : false;

        result += `
            <div class="q-selection">
                <input type="checkbox" ${is_applied ? "checked" : ""} onchange="add_question(this.checked, ${temp_question.ID})">
                <label><b>${temp_question.name}</b></label>
                <p>${temp_question.description}</p>
                
                <div class="input" ${!is_applied ? "style='display: none;'" : ""} >
                    <label>Function Name Points</label>
                    <input type="number" step="1" placeholder="For function name" onchange="change_points(this.value, ${temp_question.ID}, 'function_name_points')" value="${temp_status ? temp_status.function_name_points : ""}" />
                </div>
                <div class="input" ${!is_applied ? "style='display: none;'" : ""} >
                    <label>Constraint Points</label>
                    <input type="number" step="1" placeholder="For constraint" onchange="change_points(this.value, ${temp_question.ID}, 'constraint_points')" value="${temp_status ? temp_status.constraint_points : ""}" />
                </div>
                <div class="input" ${!is_applied ? "style='display: none;'" : ""} >
                    <label>Colon Points</label>
                    <input type="number" step="1" placeholder="For colon" onchange="change_points(this.value, ${temp_question.ID}, 'colon_points')" value="${temp_status ? temp_status.colon_points : ""}" />
                </div>
                <div class="input" ${!is_applied ? "style='display: none;'" : ""} >
                    <label>Test 1 Points</label>
                    <input type="number" step="1" placeholder="For Test 1" onchange="change_points(this.value, ${temp_question.ID}, 'output1_points')" value="${temp_status ? temp_status.output1_points : ""}" />
                </div>
                <div class="input" ${!is_applied ? "style='display: none;'" : ""} >
                    <label>Test 2 Points</label>
                    <input type="number" step="1" placeholder="For Test 2" onchange="change_points(this.value, ${temp_question.ID}, 'output2_points')" value="${temp_status ? temp_status.output2_points : ""}" />
                </div>
                <div class="input" ${!is_applied ? "style='display: none;'" : ""} >
                    <label>Test 3 Points</label>
                    <input type="number" step="1" placeholder="For Test 3" onchange="change_points(this.value, ${temp_question.ID}, 'output3_points')" value="${temp_status ? temp_status.output3_points : ""}" />
                </div>
                <div class="input" ${!is_applied ? "style='display: none;'" : ""} >
                    <label>Test 4 Points</label>
                    <input type="number" step="1" placeholder="For Test 4" onchange="change_points(this.value, ${temp_question.ID}, 'output4_points')" value="${temp_status ? temp_status.output4_points : ""}" />
                </div>
                <div class="input" ${!is_applied ? "style='display: none;'" : ""} >
                    <label>Test 5 Points</label>
                    <input type="number" step="1" placeholder="For Test 5" onchange="change_points(this.value, ${temp_question.ID}, 'output5_points')" value="${temp_status ? temp_status.output5_points : ""}" />
                </div>
                <div class="input" ${!is_applied ? "style='display: none;'" : ""} >
                    <label>Test 6 Points</label>
                    <input type="number" step="1" placeholder="For Test 6" onchange="change_points(this.value, ${temp_question.ID}, 'output6_points')" value="${temp_status ? temp_status.output6_points : ""}" />
                </div>
            </div>
        `;
    }

    return result;
}

function get_question_data() {
    return `
            <div>
                <div class="act-container">
                    <h3>General Information:</h3>
                </div>
                <div class="general-container">
                <div class="general-block">
                <div class="input">
                    <label for="question_name">Name</label>
                    <input type="text" name="question_name" placeholder="Type Question Name" value="${current_question ? current_question.name : ""}" onchange="change_question_field('name', this.value)" />
                </div>
                <div class="input">
                    <label for="question_description">Short Description</label>
                    <input type="text" name="question_description" placeholder="Type Question Description" value="${current_question ? current_question.description : ""}" onchange="change_question_field('description', this.value)" />
                </div>
                <div class="input">
                    <label for="difficultyID">Difficulty</label>
                    <select id="difficultyID" value="${current_question ? Number(current_question.difficultyID) : ""}" onchange="change_question_field('difficultyID', this.value)">
                        ${get_difficulties()}
                    </select>
                </div>
                </div>
                <div class="general-block">
                <div class="input">
                    <label for="topicID">Topic</label>
                    <select id="topicID" value="${current_question ? Number(current_question.topicID) : ""}" onchange="change_question_field('topicID', this.value)">
                        ${get_topics()}
                    </select>
                </div>
                <div class="input">
                    <label for="constraintID">Constraint</label>
                    <select id="constraintID" value="${current_question ? Number(current_question.constraintID) : ""}" onchange="change_question_field('constraintID', this.value)">
                        ${get_constraints()}
                    </select>
                </div>
                <div class="input">
                    <label for="function_name">Function Name</label>
                    <input type="text" name="function_name" placeholder="Type Function Name" value="${current_question ? current_question.function_name : ""}" onchange="change_question_field('function_name', this.value)" />
                </div>
                </div>
                </div>
                <div class="input textarea-input">
                    <label for="question_task">Task</label>
                    <textarea name="question_task" placeholder="Type Question Task" value="${current_question ? current_question.task : ""}" onchange="change_question_field('task', this.value)"></textarea>
                </div>

                <div class="act-container">
                    <h3>Test Cases:</h3>
                </div>
                <div class="tests-container">
                <div class="test-block">
                <div class="input">
                    <label for="question_input1">Input 1</label>
                    <input type="text" name="question_input1" placeholder="Type Question Input 1" value="${current_question ? current_question.input1 : ""}" onchange="change_question_field('input1', this.value)" />
                </div>
                <div class="input">
                    <label for="question_output1">Output 1</label>
                    <input type="text" name="question_output1" placeholder="Type Question Output 1" value="${current_question ? current_question.output1 : ""}" onchange="change_question_field('output1', this.value)" />
                </div>
                </div>
                
                <div class="test-block">
                <div class="input">
                    <label for="question_input2">Input 2</label>
                    <input type="text" name="question_input2" placeholder="Type Question Input 2" value="${current_question ? current_question.input2 : ""}" onchange="change_question_field('input2', this.value)" />
                </div>
                <div class="input">
                    <label for="question_output2">Output 2</label>
                    <input type="text" name="question_output2" placeholder="Type Question Output 2" value="${current_question ? current_question.output2 : ""}" onchange="change_question_field('output2', this.value)" />
                </div>
                </div>
                
                <div class="test-block">
                <div class="input">
                    <label for="question_input3">Input 3</label>
                    <input type="text" name="question_input3" placeholder="Type Question Input 3" value="${current_question ? current_question.input3 : ""}" onchange="change_question_field('input3', this.value)" />
                </div>
                <div class="input">
                    <label for="question_output3">Output 3</label>
                    <input type="text" name="question_output3" placeholder="Type Question Output 3" value="${current_question ? current_question.output3 : ""}" onchange="change_question_field('output3', this.value)" />
                </div>
                </div>
                
                <div class="test-block">
                <div class="input">
                    <label for="question_input4">Input 4</label>
                    <input type="text" name="question_input4" placeholder="Type Question Input 4" value="${current_question ? current_question.input4 : ""}" onchange="change_question_field('input4', this.value)" />
                </div>
                <div class="input">
                    <label for="question_output4">Output 4</label>
                    <input type="text" name="question_output4" placeholder="Type Question Output 4" value="${current_question ? current_question.output4 : ""}" onchange="change_question_field('output4', this.value)" />
                </div>
                </div>
                
                <div class="test-block">
                <div class="input">
                    <label for="question_input5">Input 5</label>
                    <input type="text" name="question_input5" placeholder="Type Question Input 5" value="${current_question ? current_question.input5 : ""}" onchange="change_question_field('input5', this.value)" />
                </div>
                <div class="input">
                    <label for="question_output5">Output 5</label>
                    <input type="text" name="question_output5" placeholder="Type Question Output 5" value="${current_question ? current_question.output5 : ""}" onchange="change_question_field('output5', this.value)" />
                </div>
                </div>
                
                <div class="test-block">
                <div class="input">
                    <label for="question_input6">Input 6</label>
                    <input type="text" name="question_input6" placeholder="Type Question Input 6" value="${current_question ? current_question.input6 : ""}" onchange="change_question_field('input6', this.value)" />
                </div>
                <div class="input">
                    <label for="question_output6">Output 6</label>
                    <input type="text" name="question_output6" placeholder="Type Question Output 6" value="${current_question ? current_question.output6 : ""}" onchange="change_question_field('output6', this.value)" />
                </div>
                </div>
                </div>

                <div class="form-buttons">
                    <button class="new-button btn-action" onclick='save_question()'>Save Question</button>
                    <button class="new-button btn-action" onclick='go_back()'>Cancel</button>
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
                    <a class="new-button" onclick='navigate("exam_submission", ${i})'>Grade Submission</a>
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
                <input type="checkbox" ${is_applied ? "checked" : ""} onchange="add_student(this.checked, ${temp_student.ID}, '${current_exam.id}')">
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

        result += `
            <div class="s-block">
                <div class="answer-header">
                    <h3>${temp_question_result.name}</h3>
                    <h4>${temp_question_result.description}</h4>
                    <p>${temp_question_result.task}</p>
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

function get_topics() {
    var result = `<option value="0">None</option>`;
    for (var i = 0; i < topics.length; i++) {
        result += `<option value="${topics[i].id}">${topics[i].name}</option>`
    }
    return result;
}

function get_difficulties() {
    var result = `<option value="0">None</option>`;
    for (var i = 0; i < difficulties.length; i++) {
        result += `<option value="${difficulties[i].id}">${difficulties[i].name}</option>`
    }
    return result;
}

function get_constraints() {
    var result = `<option value="0">None</option>`;
    for (var i = 0; i < constraints.length; i++) {
        result += `<option value="${constraints[i].id}">${constraints[i].name}</option>`
    }
    return result;
}

/* <------------ Helper Functions <------------ */




/* ------------> Logic Functions ------------> */

function add_question(value, ID) {
    if (value) {
        current_exam.questions.push({
            questionID: ID,
            function_name_points: 0,
            constraint_points: 0,
            colon_points: 0,
            output1_points: 0,
            output2_points: 0,
            output3_points: 0,
            output4_points: 0,
            output5_points: 0,
            output6_points: 0
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

function change_points(value, ID, field) {
    for (var i = 0; i < current_exam.questions.length; i++) {
        if (current_exam.questions[i].questionID == ID) {
            current_exam.questions[i][field] = Number(value);
            break;
        }
    }
}

function add_student(value, ID, examID) {
    if (value) {
        var data = { studentID: ID, examID: examID };

        const http = new XMLHttpRequest();
        const url = pre_url + 'api/enroll_student.php';

        http.open("POST", url, true);
        http.setRequestHeader("Content-type", "application/json");
        http.send(JSON.stringify(data));

        http.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //var result = JSON.parse(http.responseText);
                toggle_loading(false);
                navigate("exam_submissions", current_exam.id);
                //document.getElementById("submissions_container").innerHTML = get_submissions();
            }
        }
    }
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

function change_filter(field, value, id) {
    filtered_questions_list = [];
    current_filter[field] = value;

    for (var i = 0; i < questions_list.length; i++) {
        var topicCheck = true;
        var difficultyCheck = true;
        var keywordCheck = true;

        if (questions_list[i].description.toLowerCase().indexOf(current_filter.keyword.toLowerCase()) == -1) {
            keywordCheck = false;
        }

        if (questions_list[i].difficultyID != current_filter.difficultyID && current_filter.difficultyID != 0) {
            difficultyCheck = false;
        }

        if (questions_list[i].topicID != current_filter.topicID && current_filter.topicID != 0) {
            difficultyCheck = false;
        }

        if (topicCheck && difficultyCheck && keywordCheck) {
            filtered_questions_list.push(questions_list[i]);
        }
    }

    if (id == 1) {
        document.getElementById("questions-container").innerHTML = get_questions();
    }
}

function reset_filter(id) {
    current_filter = copy(new_filter);
    filtered_questions_list = questions_list;

    document.getElementById("difficultyID_filter").value = current_filter.difficultyID;
    document.getElementById("topicID_filter").value = current_filter.topicID;
    document.getElementById("keyword_filter").value = current_filter.keyword;

    if (id == 1) {
        document.getElementById("questions-container").innerHTML = get_questions();
    }
}

function save_exam() {
    var data = { ...current_exam, token: sessionStorage.getItem("token") };

    const http = new XMLHttpRequest();
    const url = pre_url + 'api/save_exam.php';

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(data));

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            toggle_loading(false);
            navigate("exams");
        }
    }
}

function save_question() {
    var data = { ...current_question, token: sessionStorage.getItem("token") };

    const http = new XMLHttpRequest();
    const url = pre_url + 'api/save_question.php';

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(data));

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            toggle_loading(false);
            navigate("questions");
        }
    }
}

function save_submission() {
    var data = { ...current_submission, token: sessionStorage.getItem("token") };

    const http = new XMLHttpRequest();
    const url = pre_url + 'api/save_teacher_submission.php';

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(data));

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            toggle_loading(false);
            navigate("exam_submissions", current_exam.ID);
        }
    }
}

/* <------------ Logic Functions <------------ */




/* ------------> Navigation ------------> */

function navigate(place, sup_data = null, sup_data2 = null) {
    var title = "Home";

    switch (place) {
        case "log_out": {
            sessionStorage.removeItem("token");
            window.location.href = "index.html";
        }
        case "home": {
            title = "Home";
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

                    url = pre_url + 'api/get_topics.php';
                    http.open("POST", url, true);
                    http.setRequestHeader("Content-type", "application/json");
                    http.send(JSON.stringify(data));

                    http.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            var result = JSON.parse(http.responseText);
                            topics = result;

                            url = pre_url + 'api/get_difficulties.php';
                            http.open("POST", url, true);
                            http.setRequestHeader("Content-type", "application/json");
                            http.send(JSON.stringify(data));

                            http.onreadystatechange = function () {
                                if (this.readyState == 4 && this.status == 200) {
                                    var result = JSON.parse(http.responseText);
                                    difficulties = result;

                                    url = pre_url + 'api/get_constraints.php';
                                    http.open("POST", url, true);
                                    http.setRequestHeader("Content-type", "application/json");
                                    http.send(JSON.stringify(data));

                                    http.onreadystatechange = function () {
                                        if (this.readyState == 4 && this.status == 200) {
                                            var result = JSON.parse(http.responseText);
                                            constraints = result;

                                            toggle_loading(false);
                                            container.innerHTML = home_view();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            break;
        }
        case "exams": {
            title = "Exams";
            toggle_loading(true);

            var data = { token: sessionStorage.getItem("token") };

            const http = new XMLHttpRequest();
            const url = pre_url + 'api/get_exams.php';

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
            title = "Questions";
            toggle_loading(true);

            var data = { token: sessionStorage.getItem("token") };

            const http = new XMLHttpRequest();
            const url = pre_url + 'api/get_questions.php';

            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/json");
            http.send(JSON.stringify(data));

            http.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var result = JSON.parse(http.responseText);
                    questions_list = result;
                    filtered_questions_list = questions_list;
                    current_filter = copy(new_filter);

                    toggle_loading(false);
                    container.innerHTML = questions_view();
                }
            }
            break;
        }
        case "exam_create": {
            title = "Create Exam";
            current_exam = null;

            toggle_loading(true);

            var data = { token: sessionStorage.getItem("token") };

            const http = new XMLHttpRequest();
            const url = pre_url + 'api/get_questions.php';

            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/json");
            http.send(JSON.stringify(data));

            http.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var result = JSON.parse(http.responseText);
                    questions_list = result;
                    filtered_questions_list = questions_list;
                    current_filter = copy(new_filter);

                    toggle_loading(false);
                    current_exam = copy(new_exam);
                    container.innerHTML = exam_create_view();
                }
            }
            break;
        }
        case "exam_edit": {
            title = "Edit Exam";
            toggle_loading(true);

            var data = { token: sessionStorage.getItem("token") };

            const http = new XMLHttpRequest();
            const url = pre_url + 'api/get_questions.php';

            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/json");
            http.send(JSON.stringify(data));

            http.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var result = JSON.parse(http.responseText);
                    questions_list = result;
                    filtered_questions_list = questions_list;
                    current_filter = copy(new_filter);

                    toggle_loading(false);
                    current_exam = exams_list[sup_data];
                    container.innerHTML = exam_edit_view();
                }
            }
            break;
        }
        case "question_create": {
            title = "Create Question";
            current_question = null;
            current_question = copy(new_question);
            container.innerHTML = question_create_view();
            break;
        }
        case "question_edit": {
            title = "Edit Question";
            current_question = null;
            current_question = questions_list[sup_data];
            container.innerHTML = question_edit_view();
            break;
        }
        case "exam_submissions": {
            title = "Exam Submissions";
            toggle_loading(true);

            var data = { token: sessionStorage.getItem("token"), examID: sup_data };

            const http = new XMLHttpRequest();
            var url = pre_url + 'api/get_exam_submissions.php';

            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/json");
            http.send(JSON.stringify(data));

            http.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var result = JSON.parse(http.responseText);
                    submissions_list = result;

                    data = { token: sessionStorage.getItem("token") };
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
                                var ex_id = 0;

                                for (var i = 0; i < exams_list.length; i++) {
                                    if (exams_list[i].id == sup_data) {
                                        ex_id = i;
                                        break;
                                    }
                                }

                                current_exam = exams_list[ex_id];
                                current_submissions = submissions_list;
                            }

                            container.innerHTML = exam_submissions_view();
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

/* <------------ Navigation <------------ */

navigate("home");