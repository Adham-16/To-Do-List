let inputButton = document.querySelector(".input");
let submitButton = document.querySelector(".add");
let tasks = document.querySelector(".tasks");

let TasksArray = [];
let UpdateMode = false;

// Check if Theres Tasks In Local Storage
if (localStorage.getItem('tasks')) {
    TasksArray = JSON.parse(localStorage.getItem('tasks'))
}

// Get Data From Local Storage
getData()

// Add a new task after pressing the button
submitButton.addEventListener("click", () => {
    validate();
});

// validation function after submit
function validate() {
    if (inputButton.value != "") {
        if (UpdateMode) {
            UpdateTask()
        } else {
            AddTaskToArray(inputButton.value);
            inputButton.value = "";
        }

    }
}

// This function is used to fetch tasks in the Local Storage to display them.
function getData() {
    let data = localStorage.getItem('tasks')
    if (data) {
        let tasks = JSON.parse(data)
        display(tasks)
    }
}



// This function performs a set of four functions:
function AddTaskToArray(inputButton) {
    const task = {
        id: Date.now(),
        title: inputButton,
        completed: false,
    };

    // 1 - At first, it adds the task to the set of tasks in the array.
    TasksArray.push(task);

    // 2 - Then it displays the tasks in the frontend.
    display(TasksArray)

    // 3 - Then it saves the new task in the array.
    SaveDataInLocalStorage(TasksArray)

    // 4 - Notify the user of the success of the operation.
    showNotification("Task added successfully!");
}

// Store data in Local Storage
function SaveDataInLocalStorage(TasksArray) {
    localStorage.setItem('tasks', JSON.stringify(TasksArray))
}


// Make sure to press the delete button and the task completion button.
tasks.addEventListener('click', (e) => {
    if (e.target.classList.contains('del')) {
        deleteTask(e.target.parentElement.parentElement.getAttribute('data-id'));
    }
    if (e.target.classList.contains('update')) {
        let id = e.target.parentElement.parentElement.getAttribute('data-id');
        onModeUpdateTask(id);
    }
    // Update the mission information has been completed.
    if (e.target.classList.contains('checkboxInput')) {
        toggleStatus(e.target.parentElement.parentElement.getAttribute('data-id'))
        e.target.parentElement.parentElement.classList.toggle("done")
    }
})

// Remove the task from the list
function deleteTask(id) {
    // Delete the task that the user clicked on delete
    if (!UpdateMode && inputButton.value == "") {
        TasksArray = TasksArray.filter((task) => task.id != id)
        display(TasksArray)
        // Edit Local Storage after removing task
        SaveDataInLocalStorage(TasksArray)

        showNotification("Task deleted successfully!");
    }
}

// Preparing to enter task update mode
function onModeUpdateTask(id) {
    let taskToEdit = TasksArray.find((task) => task.id == id);
    if (taskToEdit.completed == false) {
        UpdateMode = true
        submitButton.value = "UpDate"
        submitButton.style.backgroundColor = 'rgb(245, 119, 35)';
        if (taskToEdit) {
            inputButton.value = taskToEdit.title;
            inputButton.setAttribute("data-id", id);
        }
    }
}

// Update the task, add it to the array, display it in the frontend, and add it to the local store.
function UpdateTask() {
    console.log('hi');
    let id = inputButton.getAttribute("data-id");
    let updatedTitle = inputButton.value;
    for (let i = 0; i < TasksArray.length; i++) {
        if (TasksArray[i].id == id) {
            TasksArray[i].title = updatedTitle;
            break;
        }
    }

    display(TasksArray);
    SaveDataInLocalStorage(TasksArray);

    showNotification("Task updated successfully!");
    submitButton.value = "Add Task"
    inputButton.value = "";
    inputButton.removeAttribute("data-id");
    submitButton.style.backgroundColor = '#3e5879';
    UpdateMode = false
}

// Display tasks data on the frontend page
function display(TasksArray) {
    if (TasksArray.length == 0) {
        tasks.style.display = "none";
    } else {
        tasks.style.display = "block";
    }
    tasks.innerHTML = "";
    for (let i = 0; i < TasksArray.length; i++) {
        tasks.innerHTML += `
        <div class="task ${TasksArray[i].completed ? "done" : ""}" data-id="${TasksArray[i].id}">
        <div>
        <input type="checkbox" class="checkboxInput" ${TasksArray[i].completed ? "checked" : ""}/>
        <p class="title">${TasksArray[i].title}</p>
        </div>
        <div>
        <button  class="del">Delete</button>
        <button   class="update">Update</button>
        </div>
        </div>
    `
    }
}



// Check if the task is completed or not
function toggleStatus(id) {
    for (let i = 0; i < TasksArray.length; i++) {
        if (TasksArray[i].id == id) {
            TasksArray[i].completed == false ? (TasksArray[i].completed = true) : (TasksArray[i].completed = false)
        }
    }
    SaveDataInLocalStorage(TasksArray)

}

// Notify the user of the success of the operation
function showNotification(message) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.classList.remove("hidden");
    notification.classList.add("show");


    setTimeout(() => {
        notification.classList.remove("show");
        notification.classList.add("hidden");
        notification.textContent = ""
    }, 3000);
}