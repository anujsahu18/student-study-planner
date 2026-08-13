let tasks = [];

async function fetchTasks() {
    try {
        const res = await fetch('/api/tasks');
        tasks = await res.json();
    } catch (err) {
        console.error('Failed to load tasks', err);
        tasks = [];
    }
}

function displayTasks() {
    const taskList = document.getElementById("taskList");
    const searchText = (document.getElementById("search")?.value || '').toLowerCase();
    const filter = (document.getElementById("filter")?.value) || 'all';

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(item => {
        const subject = (item.subject || "").toLowerCase();
        const task = (item.task || "").toLowerCase();

        const matchesSearch = subject.includes(searchText) || task.includes(searchText);
        const matchesFilter = filter === "all" || (filter === "completed" && item.completed) || (filter === "pending" && !item.completed);
        return matchesSearch && matchesFilter;
    });

    filteredTasks.forEach(item => {
        const index = tasks.indexOf(item);
        const subject = item.subject || "";
        const task = item.task || "";

        const taskDiv = document.createElement("div");
        taskDiv.className = item.completed ? "task completed" : "task";

        const today = new Date().toISOString().split("T")[0];
        const overdue = !item.completed && item.date < today;
        const priority = item.priority || "Medium";

        taskDiv.innerHTML = `
            <div class="task-info">
                <strong>${escapeHtml(subject)}</strong>
                <span>${escapeHtml(task)} | 📅 ${escapeHtml(item.date)}</span>
                <span class="priority ${priority.toLowerCase()}">${priority} Priority</span>
                ${overdue ? '<span class="overdue">⚠️ Overdue</span>' : ''}
            </div>
            <div>
                <button onclick="completeTask(${index})">${item.completed ? "Undo" : "Complete"}</button>
                <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
            </div>
        `;

        taskList.appendChild(taskDiv);
    });

    updateDashboard();
}


function addTask() {

    const subject =
        document.getElementById("subject").value.trim();

    const task =
        document.getElementById("task").value.trim();

    const date =
        document.getElementById("date").value;

    const priority =
        document.getElementById("priority").value;


    if (
        subject === "" ||
        task === "" ||
        date === ""
    ) {

        alert("Please fill all fields!");

        return;
    }


    const newTask = { subject, task, date, priority, completed: false };

    // send to server
    fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
    }).then(() => refreshTasks()).catch(err => console.error(err));

    document.getElementById("subject").value = "";
    document.getElementById("task").value = "";
    document.getElementById("date").value = "";
    document.getElementById("priority").value = "Medium";
}


function completeTask(index) {

    const t = tasks[index];
    if (!t) return;
    const updated = { completed: !t.completed };
    fetch(`/api/tasks/${t._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
    }).then(() => refreshTasks()).catch(err => console.error(err));
}


function deleteTask(index) {

    const t = tasks[index];
    if (!t) return;
    fetch(`/api/tasks/${t._id}`, { method: 'DELETE' })
        .then(() => refreshTasks())
        .catch(err => console.error(err));
}


function clearCompleted() {

    const completed = tasks.filter(task => task.completed);
    Promise.all(completed.map(t => fetch(`/api/tasks/${t._id}`, { method: 'DELETE' })))
        .then(() => refreshTasks())
        .catch(err => console.error(err));
}


function saveTasks() {

    // legacy - tasks are persisted on server now
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function refreshTasks() {
    await fetchTasks();
    displayTasks();
}


function updateDashboard() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(
            task => task.completed
        ).length;

    const pending =
        total - completed;

    const percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    document.getElementById(
        "totalTasks"
    ).textContent = total;


    document.getElementById(
        "completedTasks"
    ).textContent = completed;


    document.getElementById(
        "pendingTasks"
    ).textContent = pending;


    document.getElementById(
        "progress"
    ).textContent = percentage + "%";


    document.getElementById(
        "progressText"
    ).textContent = percentage + "%";


    document.getElementById(
        "progressFill"
    ).style.width = percentage + "%";
}


function toggleTheme() {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "darkMode",
        isDark
    );

    updateThemeButton();
}


function updateThemeButton() {

    const button =
        document.getElementById("themeToggle");

    if (
        document.body.classList.contains("dark")
    ) {
        button.textContent = "☀️";
    } else {
        button.textContent = "🌙";
    }
}


if (
    localStorage.getItem("darkMode") === "true"
) {
    document.body.classList.add("dark");
}


// load tasks from server on startup
refreshTasks();

updateThemeButton();