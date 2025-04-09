const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = './db.json';

// Load tasks from file
function loadTasks() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

// Save tasks to file
function saveTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// GET /todos - get all tasks
app.get('/todos', (req, res) => {
  res.json(loadTasks());
});

// POST /todos - add a new task
app.post('/todos', (req, res) => {
  const tasks = loadTasks();
  const newTask = { id: Date.now(), text: req.body.text, completed: false };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

// PUT /todos/:id - update task status
app.put('/todos/:id', (req, res) => {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (task) {
    task.completed = req.body.completed;
    saveTasks(tasks);
    res.json(task);
  } else {
    res.status(404).send('Task not found');
  }
});

// DELETE /todos/:id - delete a task
app.delete('/todos/:id', (req, res) => {
  let tasks = loadTasks();
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  saveTasks(tasks);
  res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
