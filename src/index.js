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

  return response.status(200).json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body

  const { user } = request

  const todo = { 
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  user.todos.push(todo)

  return response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params
  const { title, deadline } = request.body
  const { user } = request

  const updateTodo = user.todos.findIndex((todo) => todo.id === id)

  if (updateTodo === -1) {
    return response.status(404).json({ error: 'Todo not found!' })
  }

  user.todos[updateTodo].title = title
  user.todos[updateTodo].deadline = new Date(deadline)
  const output = user.todos[updateTodo]

  return response.status(200).json(output)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params
  const { user } = request

  const updateTodo = user.todos.findIndex((todo) => todo.id === id)

  if (updateTodo === -1) {
    return response.status(404).json({ error: 'Todo not found!' })
  }

  user.todos[updateTodo].done = true
  const output = user.todos[updateTodo]

  return response.status(200).json(output)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params
  const { user } = request
  
  const findTodo = user.todos.findIndex((todo) => todo.id === id)

  if (findTodo === -1) {
    return response.status(404).json({ error: 'Todo not found!' })
  }

  const deleteTodo = user.todos.splice(findTodo, 1)

  return response.status(204).json('')
});

module.exports = app;
