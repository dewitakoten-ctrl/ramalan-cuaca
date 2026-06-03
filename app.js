const STORAGE_KEY = 'todo-list-app-v1';
const taskListElement = document.getElementById('task-list');
const taskCountElement = document.getElementById('task-count');
const newTaskInput = document.getElementById('new-task');
const addTaskButton = document.getElementById('add-task-btn');

let tasks = [];

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      tasks = JSON.parse(saved);
    } catch (error) {
      tasks = [];
    }
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function updateTaskCount() {
  const total = tasks.length;
  taskCountElement.textContent = `${total} ${total === 1 ? 'task' : 'tasks'}`;
}

function createTaskItem(task) {
  const listItem = document.createElement('li');
  listItem.className = `task-item${task.completed ? ' completed' : ''}`;
  listItem.dataset.id = task.id;

  const taskDetails = document.createElement('div');
  taskDetails.className = 'task-details';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.className = 'task-checkbox';
  checkbox.addEventListener('change', () => toggleComplete(task.id));

  taskDetails.appendChild(checkbox);

  const taskText = document.createElement('p');
  taskText.className = 'task-text';
  taskText.textContent = task.text;
  taskDetails.appendChild(taskText);

  listItem.appendChild(taskDetails);

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.className = 'small secondary';
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => startEditTask(task.id, taskText));

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'small secondary';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => removeTask(task.id));

  actions.appendChild(editButton);
  actions.appendChild(deleteButton);
  listItem.appendChild(actions);

  return listItem;
}

function renderTasks() {
  taskListElement.innerHTML = '';
  tasks.forEach((task) => {
    taskListElement.appendChild(createTaskItem(task));
  });
  updateTaskCount();
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  tasks.push({
    id: Date.now().toString(),
    text: trimmed,
    completed: false,
  });
  saveTasks();
  renderTasks();
  newTaskInput.value = '';
  newTaskInput.focus();
}

function removeTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
}

function toggleComplete(taskId) {
  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function startEditTask(taskId, taskTextElement) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'edit-input';
  input.value = task.text;

  taskTextElement.replaceWith(input);
  input.focus();

  const saveEdit = () => {
    const updatedText = input.value.trim();
    if (!updatedText) {
      removeTask(taskId);
      return;
    }
    task.text = updatedText;
    saveTasks();
    renderTasks();
  };

  const cancelEdit = () => {
    renderTasks();
  };

  input.addEventListener('blur', saveEdit);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      input.blur();
    }
    if (event.key === 'Escape') {
      cancelEdit();
    }
  });
}

addTaskButton.addEventListener('click', () => addTask(newTaskInput.value));
newTaskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask(newTaskInput.value);
  }
});

loadTasks();
renderTasks();
