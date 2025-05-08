// Get form and container elements
const form = document.getElementById('task-form');
const listsContainer = document.getElementById('lists-container');

// Store all tasks here
let tasks = [];

// Handle new task submission
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get input values
  const title = document.getElementById('task-title').value;
  const datetime = document.getElementById('task-datetime').value;
  const list = document.getElementById('task-list').value;

  // Create a new task object
  const task = {
    id: Date.now(),
    title,
    datetime,
    list,
    completed: false
  };

  // Save and reset
  tasks.push(task);
  form.reset();
  renderTasks();
});

// Display tasks grouped by list name
function renderTasks() {
  listsContainer.innerHTML = '';

  // Group tasks by their list
  const grouped = tasks.reduce((acc, task) => {
    if (!acc[task.list]) acc[task.list] = [];
    acc[task.list].push(task);
    return acc;
  }, {});

  // Create UI for each group
  for (const listName in grouped) {
    const section = document.createElement('div');
    section.classList.add('task-list');
    section.innerHTML = `<h3>${listName}</h3>`;

    // Add each task in the list
    grouped[listName].forEach(task => {
      const taskEl = document.createElement('div');
      taskEl.classList.add('task');
      if (task.completed) taskEl.classList.add('completed');

      taskEl.innerHTML = `
        <span>${task.title} <small>(${new Date(task.datetime).toLocaleString()})</small></span>
        <div>
          <button onclick="toggleComplete(${task.id})">✔</button>
          <button onclick="editTask(${task.id})">✏️</button>
          <button onclick="deleteTask(${task.id})">❌</button>
        </div>
      `;

      section.appendChild(taskEl);
    });

    listsContainer.appendChild(section);
  }
}

// Mark a task as complete or incomplete
function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  renderTasks();
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
}

// Edit a task (prefill the form)
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-datetime').value = task.datetime;
    document.getElementById('task-list').value = task.list;
    deleteTask(id); // Remove old version before updating
  }
}

// Initial render
renderTasks();
