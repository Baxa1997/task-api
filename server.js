const express = require("express");

const app = express();

app.use(express.json());

let tasks = [
  {id: 1, title: "Buy milk", done: false},
  {id: 2, title: "Walk the dog", done: true},
  {id: 3, title: "Learn Express", done: false},
];

app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});

app.get("/health", (req, res) => {
  res.json({status: "okey"});
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.get("/tasks/:taskId", (req, res) => {
  const taskId = Number(req.params.taskId);

  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({error: "Task not found"});
  }
  return res.json(task);
});

app.post("/tasks", (req, res) => {
  const {title} = req.body;

  if (!title || title.trim() === "" || typeof title !== "string") {
    return res
      .status(400)
      .json({error: "Title is required and must be a non-empty string"});
  }
  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    title: title.trim(),
    done: false,
  };

  tasks.push(newTask);

  return res.status(201).json(newTask);
});

app.put("/tasks/:taskId", (req, res) => {
  const taskId = Number(req.params.taskId);
  const {title, done} = req.body;
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({error: "Task not found"});
  }

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({error: "Title must be a non-empty string"});
    }
    task.title = title.trim();
  }

  if (done !== undefined) {
    if (typeof done !== "boolean") {
      res.status(400).json({error: "Done must be a boolean"});
    }

    task.done = done;
  }

  return res.json(task);
});

app.delete("/tasks/:taskId", (req, res) => {
  const taskId = Number(req.params.taskId);
  const index = tasks.findIndex((t) => t.id === taskId);

  if (index === -1) {
    return res.status(404).json({error: "Task not found"});
  }

  tasks.splice(index, 1);
  return res.status(204).end();
});

app.listen(3000, () => console.log("Server is running on port 3000"));
