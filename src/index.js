const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const user = users.find(user => user.username === username)

  if (!user) {
    return response.status(400).json({ message: 'User not found!' })
  }

  request.user = user

  next()
}

app.post('/users', (request, response) => {
    const { name, username } = request.body

    const UsernameAlreadyExists = users.some(
      (item) => item.username === username
    )

    if(UsernameAlreadyExists) {
      return response.status(400).json({ error: 'Username already exists!'})
  }

    const newUser = {
      name,
      username,
      id: uuidv4(),
      todos: []
    }

    users.push(newUser)

    return response.status(201).json(newUser)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request

  return response.status(200).json(user)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;