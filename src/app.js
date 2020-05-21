const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {
    url,
    title,
    techs,
    likes = 0,
  } = request.body;

  const id =  uuid();

  repositories.push({ id, url, title, techs, likes }); 

  return response.json({ id, url, title, techs, likes } );
});

app.put("/repositories/:id", (request, response) => {
  const {
    url,
    title,
    techs,
    likes,
  } = request.body;

  const { id } = request.params;

  if (likes) { return response.json({ likes: 0 })}

  const repositoryIndex = (repositories) => repositories.id === id;

  if (repositories.findIndex(repositoryIndex) < 0) { 
    return response.status(400).json('Bad Request')
  };

  repositories[repositories.findIndex(repositoryIndex)] = { id, url, title, techs };

  return response.json({ id, url, title, techs });
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = (repositories) => repositories.id === id;

  if (repositories.findIndex(repositoryIndex) < 0) { 
    return response.status(400).json('Bad Request')
  };

  repositories.splice(repositories.findIndex(repositoryIndex), 1);

  return response.status(204).json(repositories);
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = (repositories) => repositories.id === id;

  if (repositories.findIndex(repositoryIndex) < 0) { 
    return response.status(400).json('Bad Request')
  };

  repositories[repositories.findIndex(repositoryIndex)].likes++; 

  return response
    .status(200)
    .json({ likes: repositories[repositories.findIndex(repositoryIndex)].likes });
});

module.exports = app;
