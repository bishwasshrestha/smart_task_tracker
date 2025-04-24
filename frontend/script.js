const backendURL = "http://localhost:3000";

const input = document.getElementById("taskInput");
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission
    addTask(); // Call addTask function on Enter key press
  }
});

async function addTask() {
  console.log("Adding task to backend...");
  const task = document.getElementById("taskInput").value;
  await fetch(`${backendURL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: task }),
  });
  document.getElementById("taskInput").value = ""; // Clear input field
  loadTasks(); // Reload tasks after adding a new one
}

async function loadTasks() {
  const res = await fetch(`${backendURL}/tasks`);
  const data = await res.json();

  const taskList = document.getElementById("taskList");
  taskList.innerHTML = ""; // Clear existing tasks

  if (data.length === 0) {
    console.log("no data available");
    const li = document.createElement("li");
    li.textContent = "No tasks available.";
    taskList.appendChild(li);
    return;
  }

  data?.forEach((task) => {
    console.log("Loading tasks...");
    const li = document.createElement("li");
    li.classList.add("task-item");

    //Task text
    const taskText = document.createElement("span");
    taskText.textContent = task.task;
    taskText.classList.add("task-text");

    if (task.done) {
      taskText.classList.add("done");
      taskText.style.textDecoration = "line-through"; // Add class to mark as done
      taskText.textContent += " ✔️"; // Append checkmark to the task text
    }
    //check if task is done and add class to the list item
    check_category(task, li);
    //Expandable action menu
    const actionMenu = document.createElement("div");
    actionMenu.classList.add("action-menu");
    actionMenu.style.display = "none"; // Initially hidden

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "✔️ Done";
    doneBtn.onclick = () => markTaskDone(task.id, taskText);
    actionMenu.appendChild(doneBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️ Delete";
    deleteBtn.onclick = () => deleteTask(task.id);
    actionMenu.appendChild(deleteBtn);

    taskList.appendChild(li);
    li.appendChild(taskText);
    li.appendChild(actionMenu);

    li.onclick = () => {
      // Toggle action menu visibility on task click
      actionMenu.style.display =
        actionMenu.style.display == "none" ? "block" : "none";
    };
  });
}

function markTaskDone(taskId, taskText) {
  fetch(`${backendURL}/tasks/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done: true }),
  })
    .then(() => loadTasks())
    .catch((error) => console.error("Error marking task as done:", error));
}

function deleteTask(taskId) {
  console.log("Deleting task with ID:", taskId);
  fetch(`${backendURL}/tasks/${taskId}`, {
    method: "DELETE",
  })
    .then(() => loadTasks())
    .catch((error) => console.error("Error deleting task:", error));
}
window.onload = async () => {
  loadTasks();
};

function check_category(task, li) {
  // Check the category of the task and add corresponding class to the list item

  switch (task.suggestion.category) {
    case "Work":
      li.classList.add("work");
      break;
    case "Education":
      li.classList.add("education");
      break;
    case "Shopping":
      li.classList.add("shopping");
      break;
    case "Health":
      li.classList.add("health");
      break;
    default:
      li.classList.add("chores");
  }
}
