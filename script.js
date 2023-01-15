// required elements
const userInput = document.querySelector(".inputBox input");
const addTask = document.querySelector(".inputBox button");
const taskList = document.querySelector(".taskList");
const clearAllTasks = document.querySelector(".footer button");

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

// when user clicks on pen icon button
addTask.onclick = () => {
    let userTask = userInput.value; // get user input
    let localStorageData = localStorage.getItem("New Todo"); // getting local storage of browser
    if (localStorageData == null) { // if local storage has no data
        arrayList = []; // create a blank array
    } else {
        arrayList = JSON.parse(localStorageData); // transform json string into a js object
    }
    if (arrayList.includes(userTask)) { // check for duplicate tasks
        alert(`"${userTask}" already exists. Please add a different task.`); // alert the user to add different task
    } else {
        arrayList.push(userTask);  // push or add a new value in array
        localStorage.setItem("New Todo", JSON.stringify(arrayList)); // transform js object into a json string
        showTasks(); // call showTask function
    }
    addTask.classList.remove("active"); // deactivate the add button once the task is added
}

userInput.addEventListener("keyup", (event) => {
    let userTask = userInput.value; // get user input
    if (event.key === "Enter" && (userInput.value.length == 0 || userTask.trim() >= 0)) {
        // detect if user presses enter key to add a todo
        alert("You need to write a todo")
    } else if (event.key === "Enter" && userInput.value.length >= 1 && userTask.trim() != 0) {
        let userTask = userInput.value; // get user input
        let localStorageData = localStorage.getItem("New Todo"); // getting local storage of browser
        if (localStorageData == null) { // if local storage has no data
            arrayList = []; // create a blank array
        } else {
            arrayList = JSON.parse(localStorageData);  // transform json string into a js object
        }
        if (arrayList.includes(userTask)) { // check for duplicate tasks
            alert(`"${userTask}" already exists. Please add a different task.`); // alert the user to add different task
        } else {
            arrayList.push(userTask);  // push or add a new value in array
            localStorage.setItem("New Todo", JSON.stringify(arrayList)); // transform js object into a json string
            showTasks(); // call showTask function
        }
        addTask.classList.remove("active"); // deactivate the add button once the task is added
    }
});

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
        clearAllTasks.classList.remove("active"); //deactivate the delete button
    }
    let newLiTag = "";
    arrayList.forEach((element, index) => {
        newLiTag += `<li>${element}<span class="icon edit" onclick="editTask(${index})"><i class="fas fa-edit"></i></span> <span class="icon delete" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></span></li>`;
    });
    taskList.innerHTML = newLiTag; // add new li tag inside ul tag
    userInput.value = ""; // once task added leave the user input box blank
    taskList.scrollTop = taskList.scrollHeight; // scroll to the bottom of the list as new tasks are added
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
    let localStorageData = localStorage.getItem("New Todo"); // get local storage of browser
    if (localStorageData == null) { // if local storage has no data
        arrayList = []; // create a blank array
    } else {
        arrayList = JSON.parse(localStorageData); // transform json string into a js object
    }
    let task = arrayList[index];
    userInput.value = task; // modify the current task
    arrayList.splice(index, 1); // delete or remove the li
    localStorage.setItem("New Todo", JSON.stringify(arrayList));
    const currentTask = document.getElementById(`task-${index}`); // update the current task
    currentTask.innerHTML = userInput.value;
}

// deletes all tasks function
clearAllTasks.onclick = () => {
    arrayList = []; // empty the array
    localStorage.setItem("New Todo", JSON.stringify(arrayList)); // set the item in local storage
    showTasks(); // call the showTasks function
}