// required elements
const userInput = document.querySelector(".inputBox input");
const addTask = document.querySelector(".inputBox button");
const taskList = document.querySelector(".taskList");
const clearAllTasks = document.querySelector(".footer button");
let isPageRefreshed;
let currentScrollPos;
let newTask;

// function to sort the tasks by drag and drop functionality
function sortable() {
    // check if device has a touchscreen
    if (!("ontouchstart" in window)) {
        sortable = new Sortable(taskList, {
            animation: 250,
            handle: ".drag",
            easing: "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
            ghostClass: "ghost",
            onEnd: function (evt) {
                // get the item that was dragged
                const item = tasksList.splice(evt.oldIndex, 1)[0];
                // insert the item at its new position
                tasksList.splice(evt.newIndex, 0, item);
                // update localStorage with the Tasks list
                localStorage.setItem("Tasks", JSON.stringify(tasksList));
                // call the showTask function
                showTasks();
            }
        });
    }
    // device does not have a touch screen
    else {
        sortable = new Sortable(taskList, {
            animation: 250,
            handle: ".move",
            easing: "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
            ghostClass: "ghost",
            touchAction: "auto",
            onEnd: function (evt) {
                // get the item that was dragged
                const item = tasksList.splice(evt.oldIndex, 1)[0];
                // insert the item at its new position
                tasksList.splice(evt.newIndex, 0, item);
                // update localStorage with the Tasks list
                localStorage.setItem("Tasks", JSON.stringify(tasksList));
                // call the showTask function
                showTasks();
            }
        });
    }
}

// on load function
window.onload = function () {
    isPageRefreshed = sessionStorage.getItem('refreshed') === 'true';
    sessionStorage.setItem('refreshed', true);
    // call the sortable function to add drag and drop features
    sortable();
    displayDateTime();
    showDate();
}

// onkeyup event
userInput.onkeyup = () => {
    let userTask = userInput.value; // get user input
    if (userTask.trim() != 0) { // check if the user input doesn't contain only spaces.
        addTask.classList.add("active"); // activate the add button
    } else {
        addTask.classList.remove("active"); // deactivate the add button
    }
}

showTasks(); // call the showTask function
let editing = false; // set editing index to false
let editingIndex; // declare editingIndex variable

// when user clicks on pen icon button
addTask.onclick = () => {
    let userTask = userInput.value; // get user input
    let Tasks = localStorage.getItem("Tasks"); // getting local storage of browser
    let CompletedTasks = localStorage.getItem("Completed Tasks"); // getting local storage of browser
    if (Tasks == null) { // if local storage has no data
        tasksList = []; // create a blank array
    } else {
        tasksList = JSON.parse(Tasks); // transform json string into a js object
    }
    if (CompletedTasks == null) { // if local storage has no data
        completedTasksList = []; // create a blank array
    } else {
        completedTasksList = JSON.parse(CompletedTasks); // transform json string into a js object
    }
    // check for duplicate tasks
    if (tasksList.map(x => x.toLowerCase().trim()).includes(userTask.toLowerCase().trim())) {
        // alert the user to add different task
        alert(`"${userTask.trim()}" already exists. Please add a different task.`);
    } else if (editing) {
        tasksList[editingIndex] = userTask; // update the task at the editing index in the array
        editing = false; // set editing to false
    } else {
        tasksList.push(userTask); // push or add a new value in array
        newTask = true
    }
    localStorage.setItem("Tasks", JSON.stringify(tasksList)); // transform js object into a json string
    localStorage.setItem("Completed Tasks", JSON.stringify(completedTasksList)); // transform js object into a json string
    showTasks(); // call showTask function
    addTask.classList.remove("active"); // deactivate the add button once the task is added
}

// press enter to add todo function
userInput.addEventListener("keyup", (event) => {
    let userTask = userInput.value; // get user input
    if (event.key === "Enter" && (userInput.value.length == 0 || userTask.trim() >= 0)) {
        // detect if user presses enter key to add a todo
        alert("You need to write a todo")
    } else if (event.key === "Enter" && userInput.value.length >= 1 && userTask.trim() != 0) {
        let Tasks = localStorage.getItem("Tasks"); // getting local storage of browser
        let CompletedTasks = localStorage.getItem("Completed Tasks"); // getting local storage of browser
        if (Tasks == null) { // if local storage has no data
            tasksList = []; // create a blank array
        } else {
            tasksList = JSON.parse(Tasks); // transform json string into a js object
        }
        if (CompletedTasks == null) { // if local storage has no data
            completedTasksList = []; // create a blank array
        } else {
            completedTasksList = JSON.parse(CompletedTasks); // transform json string into a js object
        }
        // check for duplicate tasks
        if (tasksList.map(x => x.toLowerCase().trim()).includes(userTask.toLowerCase().trim())) {
            // alert the user to add different task
            alert(`"${userTask.trim()}" already exists. Please add a different task.`);
        } else if (editing) {
            tasksList[editingIndex] = userTask; // update the task at the editing index in the array
            editing = false;
        } else {
            tasksList.push(userTask); // push or add a new value in array
            newTask = true
        }
        localStorage.setItem("Tasks", JSON.stringify(tasksList)); // transform js object into a json string
        localStorage.setItem("Completed Tasks", JSON.stringify(completedTasksList)); // transform js object into a json string
        showTasks(); // call showTask function
        addTask.classList.remove("active"); // deactivate the add button once the task is added
    }
});

// Update the pending tasks
function updatePendingTasksCount() {
    const pendingTasksNumb = document.querySelector(".pendingTasks");
    pendingTasksNumb.textContent = tasksList.length - completedTasksList.length;
}

function removeCompletedTasksNotInTaskList() {
    completedTasksList = completedTasksList.filter(function (completedTask) {
        return tasksList.includes(completedTask);
    });

    // Update the completed tasks in the local storage
    localStorage.setItem("Completed Tasks", JSON.stringify(completedTasksList));
}

// show tasks function
function showTasks() {
    let Tasks = localStorage.getItem("Tasks"); // get local storage of browser
    let CompletedTasks = localStorage.getItem("Completed Tasks"); // get local storage of browser

    if (Tasks == null) { // if local storage has no data
        tasksList = []; // create a blank array
    } else {
        tasksList = JSON.parse(Tasks); // transform json string into a js object
    }
    if (CompletedTasks == null) { // if local storage has no data
        completedTasksList = []; // create a blank array
    } else {
        completedTasksList = JSON.parse(CompletedTasks); // transform json string into a js object
    }
    // update the pending tasks count
    updatePendingTasksCount()

    if (tasksList.length > 0) { // if array length is greater than 0
        clearAllTasks.classList.add("active"); // activate the delete button
    } else {
        clearAllTasks.classList.remove("active"); // deactivate the delete button
    }

    let newLiTag = ""
    // check if device has a touch screen
    if (!("ontouchstart" in window)) {
        // display icons
        tasksList.forEach((element, index) => {
            const isCompleted = completedTasksList.includes(element);
            const completedClass = isCompleted ? "completed" : "";
            newLiTag += `<li class="drag ${completedClass}">${element}<span class="icon complete" onclick="completeTask(${index})"><i class="fa-solid fa-check"></i></span> <span class="icon edit" onclick="editTask(${index})"><i class="fa-solid fa-edit"></i></span> <span class="icon delete" onclick="deleteTask(${index})"><i class="fa-solid fa-trash"></i></span></li>`;
        });
    }
    // device does not have a touch screen
    else {
        // display icons
        tasksList.forEach((element, index) => {
            const isCompleted = completedTasksList.includes(element);
            const completedClass = isCompleted ? "completed" : "";
            newLiTag += `<li class="drag ${completedClass}"><span class="move"><i class="fas fa-arrows-alt"></i></span> <span>${element}</span> <span class="icon complete" onclick="completeTask(${index})"><i class="fa-solid fa-check"></i></span><span class="icon edit" onclick="editTask(${index})"><i class="fas fa-edit"></i></span> <span class="icon delete" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></span></li>`;
        });
    }

    taskList.innerHTML = newLiTag; // add new li tag inside ul tag
    userInput.value = ""; // once task added leave the user input box blank

    // check if a new task was added and scroll to the bottom of the list
    if (newTask == true) {
        taskList.scrollTop = taskList.scrollHeight;
        newTask = false;
    }
    removeCompletedTasksNotInTaskList()
}

function deleteTask(index) {
    let Tasks = localStorage.getItem("Tasks");
    let CompletedTasks = localStorage.getItem("Completed Tasks");
    tasksList = JSON.parse(Tasks);
    completedTasksList = JSON.parse(CompletedTasks);

    // Check if the task to delete is completed (exists in the completed tasks list)
    const completedTaskIndex = completedTasksList.indexOf(tasksList[index]);
    if (completedTaskIndex !== -1) {
        // Remove the completed task from the completed tasks list
        completedTasksList.splice(completedTaskIndex, 1);
    }

    // Remove the task from the tasks list
    tasksList.splice(index, 1);

    localStorage.setItem("Tasks", JSON.stringify(tasksList));
    localStorage.setItem("Completed Tasks", JSON.stringify(completedTasksList));
    // call the showTasks function
    showTasks();
}

// edit task function
function editTask(index) {
    editing = true; // set editing to true
    editingIndex = index; // set the index of the task that is being edited
    let task = tasksList[index]; // get the task from the array
    userInput.value = task; // set the task in the input field
}

// Function to retrieve the completed tasks array from local storage
function completeTask(index) {
    const taskText = tasksList[index];
    const taskElement = document.querySelector(`.taskList li:nth-child(${index + 1})`);
    const checkIcon = taskElement.querySelector('.icon.complete');

    // Check if the task is already completed
    if (!completedTasksList.includes(taskText)) {
        // If not completed, mark it as completed
        completedTasksList.push(taskText);
        taskElement.classList.add('completed');
        checkIcon.classList.add('active');
    } else {
        // If already completed, mark it as incomplete
        completedTasksList = completedTasksList.filter(function (task) {
            return task !== taskText;
        });
        taskElement.classList.remove('completed');
        checkIcon.classList.remove('active');
    }

    // Update the pending tasks count
    updatePendingTasksCount();

    // Update the completed tasks in the local storage
    localStorage.setItem("Completed Tasks", JSON.stringify(completedTasksList));
}

// deletes all tasks function
clearAllTasks.onclick = () => {
    tasksList = []; // empty the array
    localStorage.setItem("Tasks", JSON.stringify(tasksList)); // set the item in local storage
    showTasks(); // call the showTasks function
}

// display time function
function displayDateTime() {
    var time = new Date();
    var options = { hour: '2-digit', minute: '2-digit', hour12: true };
    var timeString = time.toLocaleString('en-US', options);
    document.getElementById("time").innerHTML = timeString;
    setTimeout(displayDateTime, 1000);
}

// display custom date function
function showDate() {
    var suffix = "", date = new Date(), dayOfMonth = date.getDate(), dayOfWeek = date.getDay(), Month = date.getMonth(),
        $today = $('#today'),
        $daymonth = $('#daymonth'),
        $month = $('#month');

    var dayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var monthArray = ["January", "February", "March", "April,", "May", "June", "July", "August", "September", "October", "November", "December"];

    switch (dayOfMonth) {
        case 1: case 21: case 31: suffix = 'st'; break;
        case 2: case 22: suffix = 'nd'; break;
        case 3: case 23: suffix = 'rd'; break;
        default: suffix = 'th';
    }

    $today.text(dayArray[dayOfWeek] + ",");
    $daymonth.text(" " + dayOfMonth + suffix);
    $month.text(monthArray[Month]);
}
