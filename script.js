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
                const item = arrayList.splice(evt.oldIndex, 1)[0];
                // insert the item at its new position
                arrayList.splice(evt.newIndex, 0, item);
                // update localStorage with the new todo list
                localStorage.setItem("New Todo", JSON.stringify(arrayList));
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
                const item = arrayList.splice(evt.oldIndex, 1)[0];
                // insert the item at its new position
                arrayList.splice(evt.newIndex, 0, item);
                // update localStorage with the new todo list
                localStorage.setItem("New Todo", JSON.stringify(arrayList));
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
    let localStorageData = localStorage.getItem("New Todo"); // getting local storage of browser
    if (localStorageData == null) { // if local storage has no data
        arrayList = []; // create a blank array
    } else {
        arrayList = JSON.parse(localStorageData); // transform json string into a js object
    }
    // check for duplicate tasks
    if (arrayList.map(x => x.toLowerCase().trim()).includes(userTask.toLowerCase().trim())) {
        // alert the user to add different task
        alert(`"${userTask.trim()}" already exists. Please add a different task.`);
    } else if (editing) {
        arrayList[editingIndex] = userTask; // update the task at the editing index in the array
        editing = false; // set editing to false
    } else {
        arrayList.push(userTask); // push or add a new value in array
        newTask = true
    }
    localStorage.setItem("New Todo", JSON.stringify(arrayList)); // transform js object into a json string
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
        let localStorageData = localStorage.getItem("New Todo"); // getting local storage of browser
        if (localStorageData == null) { // if local storage has no data
            arrayList = []; // create a blank array
        } else {
            arrayList = JSON.parse(localStorageData); // transform json string into a js object
        }
        // check for duplicate tasks
        if (arrayList.map(x => x.toLowerCase().trim()).includes(userTask.toLowerCase().trim())) {
            // alert the user to add different task
            alert(`"${userTask.trim()}" already exists. Please add a different task.`);
        } else if (editing) {
            arrayList[editingIndex] = userTask; // update the task at the editing index in the array
            editing = false;
        } else {
            arrayList.push(userTask); // push or add a new value in array
            newTask = true
        }
        localStorage.setItem("New Todo", JSON.stringify(arrayList)); // transform js object into a json string
        showTasks(); // call showTask function
        addTask.classList.remove("active"); // deactivate the add button once the task is added
    }
});

// show tasks function
function showTasks() {
    let localStorageData = localStorage.getItem("New Todo"); // get local storage of browser
    if (localStorageData == null) { // if local storage has no data
        arrayList = []; // create a blank array
    } else {
        arrayList = JSON.parse(localStorageData); // transform json string into a js object
    }
    const pendingTasksNumb = document.querySelector(".pendingTasks");
    pendingTasksNumb.textContent = arrayList.length; // pass the array length in pending tasks
    if (arrayList.length > 0) { // if array length is greater than 0
        clearAllTasks.classList.add("active"); // activate the delete button
    } else {
        clearAllTasks.classList.remove("active"); // deactivate the delete button
    }

    let newLiTag = ""
    // check if device has a touch screen
    if (!("ontouchstart" in window)) {
        // display icons
        arrayList.forEach((element, index) => {
            newLiTag += `<li class="drag">${element}<span class="icon edit" onclick="editTask(${index})"><i class="fa-solid fa-edit"></i></span> <span class="icon delete" onclick="deleteTask(${index})"><i class="fa-solid fa-trash"></i></span></li>`;
        });
    }
    // device does not have a touch screen
    else {
        // display icons
        arrayList.forEach((element, index) => {
            newLiTag += `<li><span class="move"><i class="fas fa-arrows-alt"></i></span> <span>${element}</span> <span class="icon edit" onclick="editTask(${index})"><i class="fas fa-edit"></i></span> <span class="icon delete" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></span></li>`;
        });
    }

    taskList.innerHTML = newLiTag; // add new li tag inside ul tag
    userInput.value = ""; // once task added leave the user input box blank

    // check if a new task was added and scroll to the bottom of the list
    if (newTask == true) {
        taskList.scrollTop = taskList.scrollHeight;
        newTask = false;
    }
}

// delete task function
function deleteTask(index) {
    let localStorageData = localStorage.getItem("New Todo");
    arrayList = JSON.parse(localStorageData);
    arrayList.splice(index, 1); // delete or remove the li
    localStorage.setItem("New Todo", JSON.stringify(arrayList));
    showTasks(); // call the showTasks function
}

// edit task function
function editTask(index) {
    editing = true; // set editing to true
    editingIndex = index; // set the index of the task that is being edited
    let task = arrayList[index]; // get the task from the array
    userInput.value = task; // set the task in the input field
}

// deletes all tasks function
clearAllTasks.onclick = () => {
    arrayList = []; // empty the array
    localStorage.setItem("New Todo", JSON.stringify(arrayList)); // set the item in local storage
    showTasks(); // call the showTasks function
}

// display date and time function
function displayDateTime() {
    var currentDateTime = new Date();
    var options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    var dateTimeString = currentDateTime.toLocaleString('en-US', options);
    dateTimeString = dateTimeString.replace(/,/g, "");
    document.getElementById("currentDateTime").innerHTML = dateTimeString;
    setTimeout(displayDateTime, 1000);
}