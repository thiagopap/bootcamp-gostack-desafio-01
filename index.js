const express = require("express");
const server = express();
let count = 0;

server.use(express.json());

//Middleware global
server.use((req, res, next) => {
  console.log(`Quantidade de requisições: ${++count}`);

  next();
});

//Middleware local
function checkProjectInArray(req, res, next) {
  const id = parseInt(req.params.id);
  const project = projects.find(element => element.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project does not exists." });
  }

  req.project = project;

  return next();
}

const projects = [];

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  projects.push(req.body);

  return res.json(projects);
});

server.put("/projects/:id", checkProjectInArray, (req, res) => {
  const { title } = req.body;

  const project = req.project;
  project.title = title;

  res.json(projects);
});

server.delete("/projects/:id", checkProjectInArray, (req, res) => {
  const index = projects.findIndex(element => element.id === req.project.id);
  projects.splice(index, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkProjectInArray, (req, res) => {
  const { title } = req.body;

  req.project.tasks.push(title);

  return res.json(projects);
});

server.listen(3000);
